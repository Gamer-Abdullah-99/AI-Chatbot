import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, modelType } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (modelType === "streaming") {
      const stream = await anthropic.messages.stream({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }],
      });

      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      (async () => {
        for await (const chunk of stream) {
          const content = chunk.delta.text || "";
          await writer.write(content);
        }
        writer.close();
      })();

      return new NextResponse(readable, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
    });

    return NextResponse.json({ response: response.content[0] });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
