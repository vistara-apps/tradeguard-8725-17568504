'use client';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  error?: string;
  showValue?: boolean;
  valueFormat?: (value: number) => string;
}

export default function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  error,
  showValue = true,
  valueFormat = (val) => val.toString(),
}: InputSliderProps) {
  return (
    <div className="flex flex-col mb-md">
      <div className="flex justify-between items-center mb-sm">
        <label className="text-body">{label}</label>
        {showValue && <span className="text-text-secondary">{valueFormat(value)}</span>}
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full accent-primary h-2 rounded-lg appearance-none cursor-pointer ${
          error ? 'bg-destructive/20' : 'bg-surface'
        }`}
      />
      
      <div className="flex justify-between text-xs text-text-secondary mt-1">
        <span>{valueFormat(min)}</span>
        <span>{valueFormat(max)}</span>
      </div>
      
      {error && (
        <p className="text-destructive text-sm mt-sm">{error}</p>
      )}
    </div>
  );
}
