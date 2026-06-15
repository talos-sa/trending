interface TrendLegendProps {
  series: Array<{ id: number; name: string; color: string; unit?: string; visible: boolean }>;
  onToggleSeries: (seriesId: number) => void;
}

export function TrendLegend({ series, onToggleSeries }: TrendLegendProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {series.map(item => (
        <button
          key={item.id}
          onClick={() => onToggleSeries(item.id)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors ${
            item.visible
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              : 'bg-gray-900 text-gray-500 line-through hover:bg-gray-800'
          }`}
        >
          <span
            className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span>{item.name}</span>
          {item.unit && <span className="text-gray-500">({item.unit})</span>}
        </button>
      ))}
    </div>
  );
}
