import { NextRequest, NextResponse } from "next/server";
import pool from "@/utils/db";

const AZURE_KEY = process.env.AZURE_GPT_4o_KEY || "3972eb4e50404396b23da7c6596ad1de";
const AZURE_ENDPOINT = process.env.AZURE_GPT_4o_URL || "https://rajan-m2nq2pyi-canadaeast.openai.azure.com";
const AZURE_VERSION = process.env.AZURE_GPT_4o_VERSION || "2024-08-01-preview";
const DEPLOYMENT_NAME = "gpt-4o";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        // 1. Fetch Attached Knowledge
        const query = `
            SELECT kd.title, kd.content, kd.type 
            FROM knowledge_docs kd
            JOIN agent_knowledge ak ON kd.id = ak.doc_id
            WHERE ak.agent_id = $1
        `;
        const { rows: docs } = await pool.query(query, [id]);

        if (docs.length === 0) {
            return NextResponse.json({ error: "No knowledge attached to train on." }, { status: 400 });
        }

        // 2. Prepare Context for Azure
        const knowledgeContext = docs.map((d: any) => `Source: ${d.title} (${d.type})\nContent: ${d.content.slice(0, 2000)}...`).join("\n\n");

        const systemPrompt = "You are an AI Training Supervisor. Analyze the provided knowledge documents and confirm the agent configuration.";
        const userMessage = `Please analyze the following knowledge base materials attached to this agent.
        
        ${knowledgeContext}
        
        1. Confirm the topics covered.
        2. Provide a 1-sentence summary of what the agent is now trained on.`;

        // 3. Call Azure OpenAI
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
                temperature: 0.3,
                max_tokens: 200,
            }),
        });

        if (!response.ok) {
            const err = await response.text();
            console.error("Azure Training Error:", err);
            return NextResponse.json({ error: "Azure Training Failed" }, { status: 500 });
        }

        const data = await response.json();
        const summary = data.choices[0].message.content;

        // 4. Update Agent Status to 'trained'
        // We'll also store the summary in description or stats? Maybe just console log for now or return it.
        // Let's explicitly set status = 'trained'
        await pool.query("UPDATE agents SET status = 'trained' WHERE id = $1", [id]);

        return NextResponse.json({ success: true, summary });

    } catch (error: any) {
        console.error("Training Workflow Error:", error);
        return NextResponse.json({ error: "Training workflow failed" }, { status: 500 });
    }
}
