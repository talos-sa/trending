import { useMemo } from 'react';
import { TrendAxis } from './TrendAxis';

interface TrendChartProps {
  data: Array<{ timestamp: string; value: number }>;
  width: number;
  height: number;
  min?: number;
  max?: number;
  color?: string;
  showGrid?: boolean;
}

function buildPath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

export function TrendChart({ data, width, height, min, max, color = '#3b82f6', showGrid = true }: TrendChartProps) {
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const { points, dataMin, dataMax } = useMemo(() => {
    if (data.length === 0) return { points: [], dataMin: 0, dataMax: 100 };
    const vals = data.map(d => d.value);
    const dMin = min ?? Math.min(...vals);
    const dMax = max ?? Math.max(...vals);
    const tsMin = new Date(data[0].timestamp).getTime();
    const tsMax = new Date(data[data.length - 1].timestamp).getTime();
    const range = dMax - dMin || 1;
    const timeRange = tsMax - tsMin || 1;

    const pts = data.map(d => ({
      x: ((new Date(d.timestamp).getTime() - tsMin) / timeRange) * chartW,
      y: chartH - ((d.value - dMin) / range) * chartH,
    }));

    return { points: pts, dataMin: dMin, dataMax: dMax };
  }, [data, chartW, chartH, min, max]);

  const pathD = useMemo(() => buildPath(points), [points]);

  return (
    <svg width={width} height={height} className="overflow-visible">
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        <TrendAxis type="y" min={dataMin} max={dataMax} width={chartW} height={chartH} ticks={5} />
        <TrendAxis type="x" min={new Date(data[0]?.timestamp ?? Date.now()).getTime()} max={new Date(data[data.length - 1]?.timestamp ?? Date.now()).getTime()} width={chartW} height={chartH} ticks={5} />
        {showGrid && (
          <>
            {Array.from({ length: 5 }, (_, i) => {
              const y = (i / 4) * chartH;
              return <line key={`gy${i}`} x1={0} y1={y} x2={chartW} y2={y} stroke="#1f2937" strokeWidth={1} />;
            })}
            {Array.from({ length: 5 }, (_, i) => {
              const x = (i / 4) * chartW;
              return <line key={`gx${i}`} x1={x} y1={0} x2={x} y2={chartH} stroke="#1f2937" strokeWidth={1} />;
            })}
          </>
        )}
        {pathD && (
          <path d={pathD} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
        )}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill={color} />
        ))}
      </g>
    </svg>
  );
}
