import ollama from "ollama";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    const response = await ollama.chat({
      model: "llama2",
      messages: [{ role: "user", content: prompt }],
    });

    const res = NextResponse.json({ message: response.message.content });
    return res;
  } catch (error) {
    console.error("Ollama API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from LLM" },
      { status: 500 }
    );
  }
}
