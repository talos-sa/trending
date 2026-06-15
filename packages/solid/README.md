# @talos-sa/trending-solid

Solid components for time series data visualization. SVG-based charts, interactive legends, time range controls, cursor inspection, and export.

## Installation

```bash
npm install @talos-sa/trending-solid
```

Requires `solid-js` as a peer dependency.

## Usage

```tsx
import { createSignal } from 'solid-js';
import { TrendChart, TrendLegend, TrendTimeRange, TrendExport } from '@talos-sa/trending-solid';

function Dashboard() {
  const [series, setSeries] = createSignal([
    { id: 1, name: 'Temperature', color: '#ef4444', unit: '°C', visible: true },
    { id: 2, name: 'Pressure', color: '#3b82f6', unit: 'kPa', visible: true },
  ]);

  return (
    <div>
      <TrendLegend series={series()} onToggleSeries={id => {}} />
      <TrendTimeRange range="1h" onRangeChange={r => {}} />
      <TrendChart data={[]} width={800} height={250} color="#3b82f6" />
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

## Styling

The components use Tailwind CSS utility classes. Since this package ships pre-compiled JavaScript, configure your Tailwind build to scan it:

### Tailwind CSS v4

```css
@import "tailwindcss";
@source "../node_modules/@talos-sa/trending-solid";
```

### Tailwind CSS v3

```js
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@talos-sa/trending-solid/**/*.{js,ts,jsx,tsx}",
  ],
}
```

## License

MIT
