    'use client';

    import { useState } from 'react';

    interface NumberInputProps {
      label: string;
      value: string;
      onChange: (value: string) => void;
      variant?: 'default' | 'withSteppers';
    }

    export default function NumberInput({
      label,
      value,
      onChange,
      variant = 'default',
    }: NumberInputProps) {
      const [num, setNum] = useState(value);

      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNum(e.target.value);
        onChange(e.target.value);
      };

      const increment = () => {
        const newVal = (parseFloat(num) || 0) + 1;
        setNum(newVal.toString());
        onChange(newVal.toString());
      };

      const decrement = () => {
        const newVal = Math.max(0, (parseFloat(num) || 0) - 1);
        setNum(newVal.toString());
        onChange(newVal.toString());
      };

      return (
        <div className="flex flex-col">
          <label className="text-body mb-sm">{label}</label>
          <div className="flex">
            <input
              type="number"
              value={num}
              onChange={handleChange}
              className="w-full p-md bg-surface border rounded-md shadow-input focus:outline-accent"
            />
            {variant === 'withSteppers' && (
              <div className="flex flex-col ml-sm">
                <button onClick={increment} className="bg-primary text-bg p-sm rounded-t-md">+</button>
                <button onClick={decrement} className="bg-primary text-bg p-sm rounded-b-md">-</button>
              </div>
            )}
          </div>
        </div>
      );
    }
  