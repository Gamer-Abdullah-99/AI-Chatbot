import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
      const stream = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
        stream: true,
      });

      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      (async () => {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          await writer.write(content);
        }
        writer.close();
      })();

      return new NextResponse(readable, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
    });

    return NextResponse.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
