'use client';

import { useState, useEffect } from 'react';

interface NumberInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  variant?: 'default' | 'withSteppers';
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export default function NumberInput({
  label,
  value,
  onChange,
  variant = 'default',
  error,
  min,
  max,
  step = 1,
  placeholder = '',
}: NumberInputProps) {
  const [num, setNum] = useState(value);
  
  // Update local state when prop value changes
  useEffect(() => {
    setNum(value);
  }, [value]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNum(e.target.value);
    onChange(e.target.value);
  };
  
  const increment = () => {
    const currentVal = parseFloat(num) || 0;
    const newVal = max !== undefined ? Math.min(max, currentVal + step) : currentVal + step;
    setNum(newVal.toString());
    onChange(newVal.toString());
  };
  
  const decrement = () => {
    const currentVal = parseFloat(num) || 0;
    const newVal = Math.max(min !== undefined ? min : 0, currentVal - step);
    setNum(newVal.toString());
    onChange(newVal.toString());
  };
  
  return (
    <div className="flex flex-col mb-md">
      <label className="text-body mb-sm">{label}</label>
      <div className="flex">
        <input
          type="number"
          value={num}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full p-md bg-surface border rounded-md shadow-input focus:outline-accent ${
            error ? 'border-destructive' : 'border-accent/20'
          }`}
        />
        {variant === 'withSteppers' && (
          <div className="flex flex-col ml-sm">
            <button 
              onClick={increment} 
              className="bg-primary text-bg p-sm rounded-t-md hover:bg-primary/80 transition-base"
              disabled={max !== undefined && (parseFloat(num) || 0) >= max}
            >
              +
            </button>
            <button 
              onClick={decrement} 
              className="bg-primary text-bg p-sm rounded-b-md hover:bg-primary/80 transition-base"
              disabled={min !== undefined && (parseFloat(num) || 0) <= min}
            >
              -
            </button>
          </div>
        )}
      </div>
      {error && (
        <p className="text-destructive text-sm mt-sm">{error}</p>
      )}
    </div>
  );
}
