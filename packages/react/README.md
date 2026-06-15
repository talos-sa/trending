# @talos-sa/trending-react

React components for time series data visualization. SVG-based charts, interactive legends, time range controls, cursor inspection, and export.

## Installation

```bash
npm install @talos-sa/trending-react
```

Requires `react` and `react-dom` as peer dependencies.

## Usage

```tsx
import { useState } from 'react';
import { TrendChart, TrendLegend, TrendTimeRange, TrendExport } from '@talos-sa/trending-react';

function Dashboard() {
  const [series, setSeries] = useState([
    { id: 1, name: 'Temperature', color: '#ef4444', unit: '°C', visible: true },
    { id: 2, name: 'Pressure', color: '#3b82f6', unit: 'kPa', visible: true },
  ]);

  return (
    <div>
      <TrendLegend series={series} onToggleSeries={id => setSeries(...)} />
      <TrendTimeRange range="1h" onRangeChange={setRange} />
      <TrendChart data={points} width={800} height={250} color="#3b82f6" />
      <TrendExport onExport={format => console.log(format)} />
    </div>
  );
}
```

## Components

- **TrendChart** — SVG line chart with auto-scaled axes and grid
- **TrendLegend** — Togglable series legend
- **TrendTimeRange** — Time range preset selector
- **TrendCursor** — SVG cursor overlay with crosshairs and tooltip
- **TrendExport** — Dropdown export button (CSV, JSON, PNG)

## License

MIT
