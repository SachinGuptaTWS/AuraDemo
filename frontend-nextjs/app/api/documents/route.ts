import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import { v4 as uuidv4 } from "uuid";
import mammoth from "mammoth";

// Azure Document Intelligence Credentials
const AZURE_ENDPOINT = "https://ocr-replace-poc.cognitiveservices.azure.com/";
const AZURE_KEY = "29cb00b209a74fa683ba29c25c3c38f1";
const API_VERSION = "2023-07-31"; // v3.1 supports Office files

async function azureExtractText(buffer: Buffer, mimeType: string): Promise<string> {
    try {
        // 1. Submit for Analysis
        const analyzeUrl = `${AZURE_ENDPOINT}formrecognizer/documentModels/prebuilt-read:analyze?api-version=${API_VERSION}`;

        const response = await fetch(analyzeUrl, {
            method: "POST",
            headers: {
                "Content-Type": mimeType,
                "Ocp-Apim-Subscription-Key": AZURE_KEY
            },
            body: buffer as any // Node.js fetch supports Buffer
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Azure Submit Error:", err);
            // Fallback for DOCX if Azure fails (e.g. standard tier limitations)
            if (mimeType.includes('word') || mimeType.includes('docx')) {
                const mRes = await mammoth.extractRawText({ buffer });
                return mRes.value;
            }
            throw new Error(`Azure API Failed: ${response.statusText}`);
        }

        const operationLocation = response.headers.get("Operation-Location");
        if (!operationLocation) throw new Error("No Operation-Location header");

        // 2. Poll for Results
        let status = "running";
        let result = null;
        let attempts = 0;

        while (status === "running" || status === "notStarted") {
            if (attempts > 30) throw new Error("Azure Timeout"); // 30s max
            await new Promise(r => setTimeout(r, 1000));

            const pollRes = await fetch(operationLocation, {
                headers: { "Ocp-Apim-Subscription-Key": AZURE_KEY }
            });
            const pollData = await pollRes.json();
            status = pollData.status;

            if (status === "succeeded") {
                result = pollData.analyzeResult;
            } else if (status === "failed") {
                throw new Error("Azure Analysis Failed");
            }
            attempts++;
        }

        // 3. Extract Text lines
        if (result && result.content) {
            return result.content;
        }

        return "";

    } catch (e) {
        console.error("Azure Extract Exception:", e);
        // Fallback for DOCX if Azure failed
        if (mimeType.includes('docx')) {
            try {
                const mRes = await mammoth.extractRawText({ buffer });
                return mRes.value;
            } catch (err) { console.error("Mammoth Fallback failed"); }
        }
        throw e;
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
        const { title, type, content } = body;

        let finalContent = content;
        let size = "0 KB";

        // 1. Process File Uploads (REAL Extraction via Azure)
        if (type === 'file') {
            const parts = content.split(',');
            const rawBase64 = parts.length > 1 ? parts[1] : parts[0];
            const buffer = Buffer.from(rawBase64, 'base64');

            // Calculate Size
            const sizeInBytes = buffer.length;
            size = sizeInBytes > 1024 * 1024
                ? `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`
                : `${(sizeInBytes / 1024).toFixed(1)} KB`;

            let mimeType = "application/octet-stream";
            if (title.toLowerCase().endsWith('.pdf')) mimeType = "application/pdf";
            else if (title.toLowerCase().endsWith('.docx')) mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            else if (title.toLowerCase().endsWith('.png')) mimeType = "image/png";
            else if (title.toLowerCase().endsWith('.jpeg')) mimeType = "image/jpeg";
            else if (title.toLowerCase().endsWith('.jpg')) mimeType = "image/jpeg";

            // Extract Text
            try {
                if (title.toLowerCase().endsWith('.txt')) {
                    finalContent = buffer.toString('utf-8');
                } else {
                    finalContent = await azureExtractText(buffer, mimeType);
                }
            } catch (err) {
                console.error("Extraction workflow failed:", err);
                return NextResponse.json({ error: "Failed to extract text from document via Azure." }, { status: 500 });
            }

            if (!finalContent || finalContent.trim().length === 0) {
                return NextResponse.json({ error: "Document appears empty or unreadable." }, { status: 400 });
            }
        }

        // 2. Save to Database
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
            finalContent, // STORE EXTRACTED TEXT
            size,
            'ready'
        ];

        const { rows } = await pool.query(query, values);
        return NextResponse.json(rows[0]);

    } catch (error: any) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
    }
}
