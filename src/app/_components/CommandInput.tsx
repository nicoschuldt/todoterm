import { Terminal } from "lucide-react";

interface CommandInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CommandInput({ value, onChange, onSubmit }: CommandInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <label htmlFor="cli-input" className="mr-2">
        $
      </label>
      <input
        id="cli-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-green-300 placeholder-green-700"
        placeholder="Enter task..."
      />
      <button type="submit" className="ml-2">
        <Terminal className="w-4 h-4" />
      </button>
    </form>
  );
}
