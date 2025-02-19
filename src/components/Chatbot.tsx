'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [responseType, setResponseType] = useState<'normal' | 'streaming'>('normal');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    const newChat: Message[] = [...chat, { role: 'user', content: message }];
    setChat(newChat);
    setMessage('');

    try {
      if (responseType === 'streaming') {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, modelType: 'streaming', chatHistory: chat }),
        });

        if (!res.body) throw new Error('No response body');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          assistantMessage += decoder.decode(value, { stream: true });
          let streamStarted

          if (streamStarted) {
            setChat((prevChat) => [
              ...prevChat.slice(0, -1),
              { role: 'assistant', content: assistantMessage },
            ]);
          } else {
            streamStarted = true
            setChat((prevChat) => [
              ...prevChat,
              { role: 'assistant', content: assistantMessage },
            ]);
          }

        }
      }
      else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, modelType: 'normal', chatHistory: chat }),
        });

        const data = await res.json();
        setChat((prevChat) => [
          ...prevChat,
          { role: 'assistant', content: data.response },
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chat]);

  const formatMessage = (text: string) => {
    const codeBlockRegex = /```([\s\S]*?)```/g;
    return text.split(codeBlockRegex).map((part, index) =>
      index % 2 === 1 ? (
        <pre key={index} className="bg-gray-800 text-white p-2 rounded-md overflow-x-auto">
          <code>{part}</code>
        </pre>
      ) : (
        <span key={index}>{part}</span>
      )
    );
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center p-4 bg-gray-50 text-black">
      <h1 className="text-2xl font-bold mb-4">AI Chatbot</h1>

      <div className="mb-4 ">
        <label htmlFor="responseType" className="mr-2 font-semibold">
          Response Type:
        </label>
        <select
          id="responseType"
          value={responseType}
          onChange={(e) => setResponseType(e.target.value as 'normal' | 'streaming')}
          className="p-2 border rounded-lg"
        >
          <option value="normal">Normal</option>
          <option value="streaming">Streaming</option>
        </select>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 w-full max-full p-4 border bg-white shadow rounded-lg overflow-y-auto"
      >
        {chat.map((msg, index) => (
          <div
            key={index}
            className={`w-fit max-w-[80%] p-2 mb-2 rounded-lg ${msg.role === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'bg-gray-300 text-black'
              }`}
          >
            {formatMessage(msg.content)}
          </div>
        ))}
      </div>

      <form
        className="w-full max-w-2xl mt-4 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded-lg"
        >
          {loading ? '...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
