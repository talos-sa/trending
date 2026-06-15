interface TrendCursorProps {
  x: number;
  y: number;
  visible: boolean;
  value?: number;
  timestamp?: string;
}

function formatCursorTime(ts?: string): string {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return ts;
  }
}

export function TrendCursor({ x, y, visible, value, timestamp }: TrendCursorProps) {
  if (!visible) return null;

  return (
    <g>
      <line x1={x} y1={0} x2={x} y2="100%" stroke="#6b7280" strokeWidth={1} strokeDasharray="4 2" />
      <line x1={0} y1={y} x2="100%" y2={y} stroke="#6b7280" strokeWidth={1} strokeDasharray="4 2" />
      <circle cx={x} cy={y} r={4} fill="#3b82f6" stroke="#fff" strokeWidth={1.5} />
      {(value !== undefined || timestamp) && (
        <g transform={`translate(${x + 10}, ${y - 10})`}>
          <rect x={-4} y={-4} width={130} height={36} rx={4} fill="#111827" opacity={0.9} />
          {value !== undefined && (
            <text x={0} y={8} className="text-[10px] fill-gray-300">
              {typeof value === 'number' ? value.toFixed(2) : String(value)}
            </text>
          )}
          {timestamp && (
            <text x={0} y={22} className="text-[9px] fill-gray-500">
              {formatCursorTime(timestamp)}
            </text>
          )}
        </g>
      )}
    </g>
  );
}
