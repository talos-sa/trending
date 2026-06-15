import { useMemo } from 'react';
import { Input } from './ui/Input';

interface TrendTimeRangeProps {
  range: string;
  onRangeChange: (range: string) => void;
  customStart?: string;
  customEnd?: string;
  onCustomRangeChange?: (start: string, end: string) => void;
}

const PRESETS = [
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '8h', label: '8h' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: 'custom', label: 'Custom' },
];

export function TrendTimeRange({ range, onRangeChange, customStart, customEnd, onCustomRangeChange }: TrendTimeRangeProps) {
  const isCustom = range === 'custom';

  const showCustom = useMemo(() => {
    return isCustom && onCustomRangeChange;
  }, [isCustom, onCustomRangeChange]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex bg-gray-900 rounded-lg p-0.5 gap-0.5 border border-gray-800">
        {PRESETS.map(preset => (
          <button
            key={preset.value}
            onClick={() => onRangeChange(preset.value)}
            className={`px-3 py-1.5 text-xs rounded transition-colors ${
              range === preset.value
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      {showCustom && (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Start"
            value={customStart ?? ''}
            onChange={e => onCustomRangeChange?.(e.target.value, customEnd ?? '')}
          />
          <span className="text-gray-500 text-xs">to</span>
          <Input
            type="text"
            placeholder="End"
            value={customEnd ?? ''}
            onChange={e => onCustomRangeChange?.(customStart ?? '', e.target.value)}
          />
        </div>
      )}
    </div>
  );
}
