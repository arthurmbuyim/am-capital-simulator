import * as React from "react";
import { cn } from "@/src/lib/utils";

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
  showValue?: boolean;
  showMinMax?: boolean;
  formatValue?: (value: number) => string;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({
    label,
    value,
    min,
    max,
    step = 1,
    unit,
    onChange,
    disabled = false,
    className,
    showValue = true,
    showMinMax = true,
    formatValue = (val) => val.toLocaleString('fr-FR'),
    ...props
  }, ref) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
      <div className={cn("space-y-3", className)}>
        {/* Label et valeur */}
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
          {showValue && (
            <span className="text-lg font-semibold text-blue-600">
              {formatValue(value)} {unit}
            </span>
          )}
        </div>

        {/* Container du slider */}
        <div className="relative">
          {/* Track de base */}
          <div className="w-full h-2 bg-gray-200 rounded-lg">
            {/* Track rempli */}
            <div
              className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-200"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Input range invisible */}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            disabled={disabled}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            {...props}
          />

          {/* Thumb personnalisé */}
          <div
            className={cn(
              "absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-3 border-blue-600 rounded-full shadow-lg transition-all duration-200",
              !disabled && "hover:scale-110 hover:shadow-xl",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            style={{ left: `${percentage}%` }}
          />
        </div>

        {/* Min/Max values */}
        {showMinMax && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatValue(min)} {unit}</span>
            <span>{formatValue(max)} {unit}</span>
          </div>
        )}
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };