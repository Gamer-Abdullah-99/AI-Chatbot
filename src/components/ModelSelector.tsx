interface ModelSelectorProps {
  modelType: "regular" | "streaming";
  setModelType: (model: "regular" | "streaming") => void;
}

export default function ModelSelector({
  modelType,
  setModelType,
}: ModelSelectorProps) {
  return (
    <select
      value={modelType}
      onChange={(e) => setModelType(e.target.value as "regular" | "streaming")}
      className="p-2 border rounded-lg"
    >
      <option value="regular">Regular</option>
      <option value="streaming">Streaming</option>
    </select>
  );
}
