import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/Button';

interface TrendExportProps {
  onExport: (format: 'csv' | 'json' | 'png') => void;
  exporting?: boolean;
}

const FORMATS: Array<{ value: 'csv' | 'json' | 'png'; label: string }> = [
  { value: 'csv', label: 'CSV' },
  { value: 'json', label: 'JSON' },
  { value: 'png', label: 'PNG' },
];

export function TrendExport({ onExport, exporting = false }: TrendExportProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setOpen(!open)}
        loading={exporting}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[120px] py-1">
          {FORMATS.map(f => (
            <button
              key={f.value}
              onClick={() => { onExport(f.value); setOpen(false); }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
