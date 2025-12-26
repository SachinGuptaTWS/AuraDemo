import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import crypto from "crypto";

export async function GET() {
    try {
        const { rows } = await pool.query('SELECT * FROM knowledge_docs ORDER BY created_at DESC');

        const docs = rows.map(row => ({
            id: row.id,
            title: row.title,
            type: row.type,
            content: row.content,
            size: row.size,
            createdAt: row.created_at,
            status: row.status
        }));

        return NextResponse.json(docs);
    } catch (error: any) {
        console.error("Database Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, type, content } = body;
        const id = crypto.randomUUID();

        // Simple size estimation
        const size = content.length > 1024 ? `${(content.length / 1024).toFixed(1)} KB` : `${content.length} B`;

        const query = `
      INSERT INTO knowledge_docs (id, title, type, content, size, status, created_at)
      VALUES ($1, $2, $3, $4, $5, 'ready', NOW())
      RETURNING *
    `;
        const values = [id, title, type, content, size];

        const { rows } = await pool.query(query, values);
        const newDoc = rows[0];

        const responseDoc = {
            id: newDoc.id,
            title: newDoc.title,
            type: newDoc.type,
            content: newDoc.content,
            size: newDoc.size,
            createdAt: newDoc.created_at,
            status: newDoc.status
        };

        return NextResponse.json(responseDoc, { status: 201 });
    } catch (error: any) {
        console.error("FAILED to save doc:", error);
        return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
    }
}
