import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

// GET attached knowledge for an agent
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        // Join with knowledge_docs to get full doc details
        const query = `
      SELECT kd.* 
      FROM knowledge_docs kd
      JOIN agent_knowledge ak ON kd.id = ak.doc_id
      WHERE ak.agent_id = $1
      ORDER BY ak.created_at DESC
    `;
        const { rows } = await pool.query(query, [id]);

        // Transform specifically for UI consumption if needed, or send raw
        const docs = rows.map(row => ({
            id: row.id,
            title: row.title,
            type: row.type,
            size: row.size,
            createdAt: row.created_at,
            status: row.status
        }));

        return NextResponse.json(docs);
    } catch (error: any) {
        console.error("Fetch Knowledge Error:", error);
        return NextResponse.json({ error: "Failed to fetch attached knowledge" }, { status: 500 });
    }
}

// POST attach a doc to an agent
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { docId } = body;

        if (!docId) {
            return NextResponse.json({ error: "docId is required" }, { status: 400 });
        }

        await pool.query(
            'INSERT INTO agent_knowledge (agent_id, doc_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [id, docId]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Attach Knowledge Error:", error);
        return NextResponse.json({ error: "Failed to attach document" }, { status: 500 });
    }
}

// DELETE detach a doc
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        // query params only
        // Actually, for DELETE, standard is often params /knowledge/[docId]
        // But here I'm using body for simplicity to stay in same route file.
        // Wait, DELETE with body is sometimes ignored by some proxies/browsers.
        // I'll check url search params? ?docId=...

        const { searchParams } = new URL(req.url);
        const docId = searchParams.get('docId');

        if (!docId) {
            return NextResponse.json({ error: "docId param is required" }, { status: 400 });
        }

        await pool.query(
            'DELETE FROM agent_knowledge WHERE agent_id = $1 AND doc_id = $2',
            [id, docId]
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to detach document" }, { status: 500 });
    }
}
