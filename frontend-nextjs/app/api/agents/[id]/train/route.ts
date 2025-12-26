import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

const AZURE_KEY = process.env.AZURE_GPT_4o_KEY || "3972eb4e50404396b23da7c6596ad1de";
const AZURE_ENDPOINT = process.env.AZURE_GPT_4o_URL || "https://rajan-m2nq2pyi-canadaeast.openai.azure.com";
const AZURE_VERSION = process.env.AZURE_GPT_4o_VERSION || "2024-08-01-preview";
const DEPLOYMENT_NAME = "gpt-4o";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // 1. Fetch Current Agent Instructions
        const agentRes = await pool.query("SELECT description FROM agents WHERE id = $1", [id]);
        if (agentRes.rows.length === 0) return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        const currentInstructions = agentRes.rows[0].description || "";

        // 2. Fetch Attached Knowledge (Actual Text Content)
        const query = `
            SELECT kd.title, kd.content, kd.type 
            FROM knowledge_docs kd
            JOIN agent_knowledge ak ON kd.id = ak.doc_id
            WHERE ak.agent_id = $1
        `;
        const { rows: docs } = await pool.query(query, [id]);

        if (docs.length === 0) {
            return NextResponse.json({ error: "No knowledge attached. Please attach documents first." }, { status: 400 });
        }

        // Limit context to avoid token limits (Real world safety)
        // We take up to 20,000 chars roughly.
        const knowledgeContext = docs.map((d: any) => `
        --- BEGIN SOURCE: ${d.title} (${d.type}) ---
        ${d.content.slice(0, 10000)}
        --- END SOURCE ---
        `).join("\n\n");

        // 3. REAL TRAINING via Prompt Engineering (System Prompt Injection)
        const systemPrompt = "You are an Expert AI System Architect. Your job is to rewrite an AI Agent's 'System Instructions' to incorporate new knowledge.";
        const userMessage = `
        CURRENT SYSTEM INSTRUCTIONS:
        ${currentInstructions}

        NEW KNOWLEDGE TO INTEGRATE:
        ${knowledgeContext}

        TASK:
        Rewrite the System Instructions to preserve the original personality/role but APPEND a specific "Knowledge Base" section containing a comprehensive summary of the new facts. 
        The Agent must be able to answer questions based on this knowledge.
        Return ONLY the new System Instructions text. Do not add markdown blocks like \`\`\`.
        `;

        const url = `${AZURE_ENDPOINT}/openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${AZURE_VERSION}`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": AZURE_KEY,
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userMessage },
                ],
                temperature: 0.1, // Low temp for precision
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Azure Training Error:", err);
            return NextResponse.json({ error: "Azure Training Failed" }, { status: 500 });
        }

        const data = await response.json();
        const newInstructions = data.choices[0].message.content;

        // 4. Update Agent with NEW Intelligence
        await pool.query(
            "UPDATE agents SET description = $1, status = 'trained' WHERE id = $2",
            [newInstructions, id]
        );

        return NextResponse.json({
            success: true,
            summary: "Agent instructions have been rewritten to include the knowledge base."
        });

    } catch (error: any) {
        console.error("Training Workflow Error:", error);
        return NextResponse.json({ error: "Training workflow failed" }, { status: 500 });
    }
}
