import { useMemo } from 'react';

interface TrendAxisProps {
  type: 'x' | 'y';
  min: number;
  max: number;
  ticks?: number;
  width: number;
  height: number;
  unit?: string;
}

function formatTimeLabel(value: number): string {
  const date = new Date(value);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatValue(value: number, decimals: number = 1): string {
  return value.toFixed(decimals);
}

export function TrendAxis({ type, min, max, ticks = 5, width, height, unit }: TrendAxisProps) {
  const tickValues = useMemo(() => {
    const result: Array<{ pos: number; label: string }> = [];
    for (let i = 0; i < ticks; i++) {
      const t = i / (ticks - 1);
      const value = min + (max - min) * t;
      const pos = type === 'y' ? height - t * height : t * width;
      const label = type === 'x' ? formatTimeLabel(value) : formatValue(value);
      result.push({ pos, label });
    }
    return result;
  }, [type, min, max, ticks, width, height]);

  if (type === 'y') {
    return (
      <g>
        {tickValues.map((tick, i) => (
          <g key={i}>
            <line x1={0} y1={tick.pos} x2={width} y2={tick.pos} stroke="#374151" strokeWidth={1} />
            <text x={-8} y={tick.pos + 4} textAnchor="end" className="text-[10px] fill-gray-500">
              {tick.label}
            </text>
          </g>
        ))}
        {unit && (
          <text x={-8} y={0} textAnchor="end" className="text-[10px] fill-gray-400" transform="rotate(-90, -8, 0)">
            {unit}
          </text>
        )}
      </g>
    );
  }

  return (
    <g>
      {tickValues.map((tick, i) => (
        <g key={i}>
          <line x1={tick.pos} y1={0} x2={tick.pos} y2={height} stroke="#374151" strokeWidth={1} />
          <text x={tick.pos} y={height + 14} textAnchor="middle" className="text-[10px] fill-gray-500">
            {tick.label}
          </text>
        </g>
      ))}
    </g>
  );
}
