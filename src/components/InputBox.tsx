interface InputBoxProps {
  message: string;
  setMessage: (msg: string) => void;
  sendMessage: () => void;
  loading: boolean;
}

export default function InputBox({
  message,
  setMessage,
  sendMessage,
  loading,
}: InputBoxProps) {
  return (
    <input
      type="text"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") sendMessage();
      }}
      placeholder="Type a message..."
      className="flex-1 p-2 border rounded-lg"
      disabled={loading}
    />
  );
}
