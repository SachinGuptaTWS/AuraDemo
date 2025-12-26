import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";
import crypto from "crypto";

export async function GET() {
    try {
        const { rows } = await pool.query('SELECT * FROM agents ORDER BY created_at DESC');

        // Transform DB rows (snake_case) to API format (camelCase)
        const agents = rows.map(row => ({
            id: row.id,
            name: row.name,
            role: row.role,
            type: row.type,
            description: row.description,
            createdAt: row.created_at,
            status: row.status,
            stats: row.stats || {}
        }));

        return NextResponse.json(agents);
    } catch (error: any) {
        console.error("Database Fetch Error:", error);
        return NextResponse.json({ error: "Failed to fetch agents", details: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    console.log("Creating agent in Neon DB...");
    try {
        const body = await req.json();
        const { name, role, type, description, stats } = body;
        const id = crypto.randomUUID();

        // Postgres insert
        const query = `
      INSERT INTO agents (id, name, role, type, description, stats, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW())
      RETURNING *
    `;
        const values = [id, name, role, type, description, stats || {}];

        const { rows } = await pool.query(query, values);
        const newAgent = rows[0];

        // Transform back to camelCase for response
        const responseAgent = {
            id: newAgent.id,
            name: newAgent.name,
            role: newAgent.role,
            type: newAgent.type,
            description: newAgent.description,
            createdAt: newAgent.created_at,
            status: newAgent.status,
            stats: newAgent.stats
        };

        console.log("Agent saved DB successfully:", id);

        return NextResponse.json(responseAgent, { status: 201 });
    } catch (error: any) {
        console.error("FAILED to save to DB:", error);
        return NextResponse.json({ error: "Failed to create agent", details: error.message }, { status: 500 });
    }
}
