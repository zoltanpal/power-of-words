// components/tag-input.tsx


import { useState } from "react";

export function TagInput({
    value,
    onChange,
    placeholder = "Enter tag..."
  }: {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    class?: string;
  }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };


  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-sm
                 focus-within:bg-gray-100 hover:bg-gray-100"
    >
      {value.map((tag) => (
        <span
          key={tag}
          className="flex items-center gap-1 rounded-md bg-gray-800 px-2 py-1 text-sm text-stone-100"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-destructive transition-colors"
          >
            ×
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
          }
        }}
        className="flex-1 border-none bg-transparent focus:outline-none placeholder:text-muted-foreground min-w-40 "
        placeholder={placeholder}
      />
    </div>
  );

}
