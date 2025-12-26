import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import mammoth from "mammoth";

// Helper to extract text
async function extractText(type: string, base64Content: string): Promise<string> {
    try {
        // base64Content usually "data:application/pdf;base64,JVBERi..."
        const parts = base64Content.split(',');
        const rawBase64 = parts.length > 1 ? parts[1] : parts[0];
        const buffer = Buffer.from(rawBase64, 'base64');

        if (type.includes('pdf') || type.includes('PDF')) {
            return new Promise((resolve, reject) => {
                // PDFParser(context?: any, needRawText?: boolean)
                const parser = new PDFParser(null, 1);

                parser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));

                parser.on("pdfParser_dataReady", (pdfData: any) => {
                    // pdfData is the raw JSON, but since we enabled raw text (1), 
                    // we can use getRawTextContent() which returns the text.
                    const text = parser.getRawTextContent();
                    resolve(text);
                });

                parser.parseBuffer(buffer);
            });
        }
        else if (type.includes('word') || type.includes('docx')) {
            const result = await mammoth.extractRawText({ buffer });
            return result.value;
        }
        else {
            // Assume plain text
            return buffer.toString('utf-8');
        }
    } catch (e) {
        console.error("Extraction Failed:", e);
        return ""; // Fallback or throw
    }
}

export async function GET() {
    try {
        const query = 'SELECT * FROM knowledge_docs ORDER BY created_at DESC';
        const { rows } = await pool.query(query);
        return NextResponse.json(rows);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch docs" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, type, content } = body; // content is base64 for file, text for text

        let finalContent = content;
        let size = "0 KB";

        if (type === 'file') {
            const isPdf = title.toLowerCase().endsWith('.pdf');
            const isDocx = title.toLowerCase().endsWith('.docx');
            const isTxt = title.toLowerCase().endsWith('.txt');

            const sizeInBytes = Math.ceil((content.length * 3) / 4);
            size = sizeInBytes > 1024 * 1024
                ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
                : `${(sizeInBytes / 1024).toFixed(1)} KB`;

            // Extract Text for Knowledge Base Intelligence (REAL EXTRACTION)
            if (isPdf) {
                finalContent = await extractText('pdf', content);
            } else if (isDocx) {
                finalContent = await extractText('docx', content);
            } else if (isTxt) {
                finalContent = await extractText('text', content);
            }

            if (!finalContent || finalContent.trim().length === 0) {
                return NextResponse.json({ error: "Could not extract text. File might be empty." }, { status: 400 });
            }
        }

        const id = uuidv4();
        const query = `
      INSERT INTO knowledge_docs (id, title, type, content, size, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const values = [
            id,
            title,
            type,
            finalContent, // Storing EXTRACTED TEXT
            size,
            'ready'
        ];

        const { rows } = await pool.query(query, values);
        return NextResponse.json(rows[0]);

    } catch (error: any) {
        console.error("Document Upload Error:", error);
        return NextResponse.json({ error: "Failed to create doc" }, { status: 500 });
    }
}
