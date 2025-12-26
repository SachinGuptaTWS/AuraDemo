import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const AGENTS_FILE = path.join(process.cwd(), "data", "agents.json");

export async function GET() {
    try {
        if (!fs.existsSync(AGENTS_FILE)) {
            return NextResponse.json([]);
        }
        const data = fs.readFileSync(AGENTS_FILE, "utf-8");
        return NextResponse.json(JSON.parse(data));
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const newAgent = {
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
            ...body,
        };

        let agents = [];
        if (fs.existsSync(AGENTS_FILE)) {
            const data = fs.readFileSync(AGENTS_FILE, "utf-8");
            agents = JSON.parse(data);
        }

        agents.push(newAgent);
        fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));

        return NextResponse.json(newAgent, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create agent" }, { status: 500 });
    }
}
