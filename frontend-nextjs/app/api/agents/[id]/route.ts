import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { rows } = await pool.query('SELECT * FROM agents WHERE id = $1', [id]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        const agent = rows[0];
        const responseAgent = {
            id: agent.id,
            name: agent.name,
            role: agent.role,
            type: agent.type,
            description: agent.description,
            createdAt: agent.created_at,
            status: agent.status,
            stats: agent.stats || {}
        };

        return NextResponse.json(responseAgent);
    } catch (error: any) {
        console.error("Error fetching agent:", error);
        return NextResponse.json({ error: "Failed to fetch agent details" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        await pool.query('DELETE FROM agents WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to delete agent" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { name, role, type, description } = body;

        const query = `
            UPDATE agents 
            SET name = $1, role = $2, type = $3, description = $4
            WHERE id = $5
            RETURNING *
        `;
        const values = [name, role, type, description, id];

        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        const agent = rows[0];
        const responseAgent = {
            id: agent.id,
            name: agent.name,
            role: agent.role,
            type: agent.type,
            description: agent.description,
            createdAt: agent.created_at,
            status: agent.status,
            stats: agent.stats || {}
        };

        return NextResponse.json(responseAgent);
    } catch (error: any) {
        console.error("Update Error:", error);
        return NextResponse.json({ error: "Failed to update agent" }, { status: 500 });
    }
}
