    'use client';

    export default function InputSlider({
      label,
      value,
      onChange,
      min,
      max,
      step,
    }) {
      return (
        <div className="flex flex-col">
          <label className="text-body mb-sm">{label}: {value}</label>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full accent-primary"
          />
        </div>
      );
    }
  