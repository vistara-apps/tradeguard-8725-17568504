'use client';

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  error,
  placeholder,
  disabled = false,
}: DropdownProps) {
  return (
    <div className="flex flex-col mb-md">
      <label className="text-body mb-sm">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`p-md bg-surface border rounded-md shadow-input focus:outline-accent ${
          error ? 'border-destructive' : 'border-accent/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-destructive text-sm mt-sm">{error}</p>
      )}
    </div>
  );
}
