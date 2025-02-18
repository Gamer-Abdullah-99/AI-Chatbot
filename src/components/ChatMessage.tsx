import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const renderMessage = (msg: string) => {
    const match = msg.match(/```(\w*)\n([\s\S]*?)```/);
    if (match) {
      const language = match[1] || "javascript";
      const code = match[2];

      return (
        <SyntaxHighlighter
          language={language}
          style={dracula}
          className="rounded-lg p-2"
        >
          {code}
        </SyntaxHighlighter>
      );
    }
    return <p>{msg}</p>;
  };

  return (
    <div
      className={`w-fit max-w-[80%] p-2 mb-2 rounded-lg ${
        role === "user"
          ? "ml-auto bg-blue-500 text-white"
          : "bg-gray-300 text-black"
      }`}
    >
      {renderMessage(content)}
    </div>
  );
}
