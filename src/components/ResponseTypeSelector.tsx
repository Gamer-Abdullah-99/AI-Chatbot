interface ResponseTypeSelectorProps {
  responseType: "normal" | "streaming";
  onChange: (type: "normal" | "streaming") => void;
}

export default function ResponseTypeSelector({
  responseType,
  onChange,
}: ResponseTypeSelectorProps) {
  return (
    <div>
      <label htmlFor="responseType" className="mr-2 font-semibold">
        Response Type:
      </label>
      <select
        id="responseType"
        value={responseType}
        onChange={(e) => onChange(e.target.value as "normal" | "streaming")}
        className="p-2 border rounded-lg"
      >
        <option value="normal">Normal</option>
        <option value="streaming">Streaming</option>
      </select>
    </div>
  );
}
