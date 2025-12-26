import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // Delete from knowledge_docs
        // Cascade delete in agent_knowledge handles detach automatically if configured, 
        // but explicit delete is safer if no cascade.

        await pool.query('DELETE FROM agent_knowledge WHERE doc_id = $1', [id]);
        await pool.query('DELETE FROM knowledge_docs WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Delete Doc Error:", error);
        return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }
}
