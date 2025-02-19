import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  const { message, modelType, chatHistory } = await req.json();

  if (!message) {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fullHistory = chatHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    fullHistory.push({
      role: "user",
      parts: [{ text: message }],
    });

    if (modelType === "streaming") {
      const stream = new ReadableStream({
        async start(controller) {
          try {
            const resultStream = await geminiModel.generateContentStream({ contents: fullHistory });

            for await (const chunk of resultStream.stream) {
              controller.enqueue(chunk.text());
            }

            controller.close();
          } catch (err) {
            controller.error(err);
          }
        },
      });

      return new Response(stream, {
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      const result = await geminiModel.generateContent({ contents: fullHistory });
      const responseText = result.response.text();

      return Response.json({ response: responseText });
    }
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
