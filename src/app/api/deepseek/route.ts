import { NextRequest, NextResponse } from "next/server";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { message, modelType } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const payload = {
      model: "deepseek-chat",
      messages: [{ role: "user", content: message }],
      temperature: 0.7,
      stream: modelType === "streaming",
    };

    if (modelType === "streaming") {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      (async () => {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          await writer.write(decoder.decode(value, { stream: true }));
        }
        writer.close();
      })();

      return new NextResponse(readable, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log(data);
    return NextResponse.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error("Error handling request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
