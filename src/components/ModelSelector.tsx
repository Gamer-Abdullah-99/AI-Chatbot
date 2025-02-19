interface ModelSelectorProps {
  selectedModel: string;
  onChange: (model: string) => void;
}

export default function ModelSelector({
  selectedModel,
  onChange,
}: ModelSelectorProps) {
  return (
    <div>
      <label htmlFor="model" className="mr-2 font-semibold">
        Model:
      </label>
      <select
        id="model"
        value={selectedModel}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded-lg"
      >
        <option value="gemini">Google Gemini</option>
        <option value="anthropic">Anthropic Claude</option>
        <option value="deepseek">DeepSeek AI</option>
        <option value="openai">OpenAI GPT</option>
      </select>
    </div>
  );
}
