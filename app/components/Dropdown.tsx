    'use client';

    interface DropdownProps {
      label: string;
      options: string[];
      value: string;
      onChange: (value: string) => void;
    }

    export default function Dropdown({
      label,
      options,
      value,
      onChange,
    }: DropdownProps) {
      return (
        <div className="flex flex-col">
          <label className="text-body mb-sm">{label}</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="p-md bg-surface border rounded-md shadow-input focus:outline-accent"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      );
    }
  