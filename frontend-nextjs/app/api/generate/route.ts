import { NextRequest, NextResponse } from "next/server";

const AZURE_KEY = process.env.AZURE_GPT_4o_KEY || "3972eb4e50404396b23da7c6596ad1de";
const AZURE_ENDPOINT = process.env.AZURE_GPT_4o_URL || "https://rajan-m2nq2pyi-canadaeast.openai.azure.com";
const AZURE_VERSION = process.env.AZURE_GPT_4o_VERSION || "2024-08-01-preview";
const DEPLOYMENT_NAME = "gpt-4o";

export async function POST(req: NextRequest) {
    try {
        const { prompt, type, role } = await req.json();

        const systemPrompt = "You are a helpful assistant that writes professional profiles.";
        const userMessage = `Please rewrite and expand the following description for a professional conversational agent.
    
    Role: ${role} (${type})
    Context/Goal: ${prompt}
    
    Output a polished, professional description paragraph.`;

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
                temperature: 0.7,
                max_tokens: 800,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Azure OpenAI Error:", errorText);
            return NextResponse.json({ error: `Azure API Error: ${response.statusText}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        const optimizedPrompt = data.choices[0].message.content;

        return NextResponse.json({ optimizedPrompt });
    } catch (error) {
        console.error("Generation Error:", error);
        return NextResponse.json({ error: "Failed to generate prompt" }, { status: 500 });
    }
}
