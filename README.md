# @talos-sa/trending

Monorepo for time series data visualization — a framework-agnostic core engine + framework-specific UI packages.

## Packages

| Package | Description |
|---------|-------------|
| `@talos-sa/trending-core` | Pure TypeScript engine, types, and web worker. Works in any JS environment. |
| `@talos-sa/trending-react` | React components. |
| `@talos-sa/trending-vue` | Vue 3 components. |
| `@talos-sa/trending-svelte` | Svelte 5 components. |
| `@talos-sa/trending-solid` | Solid components. |

---

## @talos-sa/trending-core

### Installation

```bash
npm install @talos-sa/trending-core
```

### Engine

```ts
import { TrendingEngine } from '@talos-sa/trending-core';

const engine = new TrendingEngine(3600); // max 3600 points per series

engine.record(1, 72.5, 'good', new Date().toISOString());
engine.record(2, 101.3, 'good', new Date().toISOString());

const series = engine.getTimeSeries(1);
const downsampled = engine.getDownsampled(1, startTime, endTime, 500);
```

| Method | Description |
|--------|-------------|
| `record(seriesId, value, quality, timestamp)` | Record a single data point |
| `recordBatch(dataPoints[])` | Record multiple points at once |
| `getTimeSeries(seriesId, start?, end?)` | Get all points for a series |
| `getDownsampled(seriesId, start, end, maxPoints)` | Get downsampled points for rendering |
| `clearBuffer(seriesId)` | Clear data for a specific series |
| `clearAllBuffers()` | Clear all stored data |

### Types

```ts
type DataQuality = 'good' | 'bad' | 'uncertain';

interface DataPoint {
  timestamp: string;
  value: number;
  quality: DataQuality;
}

interface TimeSeries {
  id: number;
  name: string;
  unit: string;
  points: DataPoint[];
  min: number;
  max: number;
}

interface TrendViewport {
  startTime: string;
  endTime: string;
  visibleDuration: number;
}
```

### Worker

A self-contained Web Worker for offloading downsampling and analysis is available at `packages/core/src/workers/trending.worker.ts`.

---

## @talos-sa/trending-react

### Installation

```bash
npm install @talos-sa/trending-react
```

Requires `react` and `react-dom` as peer dependencies.

### Usage

```tsx
import { useState } from 'react';
import { TrendChart, TrendLegend, TrendTimeRange, TrendExport } from '@talos-sa/trending-react';

function TrendingDashboard() {
  const [series, setSeries] = useState([
    { id: 1, name: 'Temperature', color: '#ef4444', unit: '°C', visible: true },
    { id: 2, name: 'Pressure', color: '#3b82f6', unit: 'kPa', visible: true },
  ]);

  const [range, setRange] = useState('1h');

  const data = series.flatMap(s =>
    s.visible ? [{ series: s, points: generateData(s, range) }] : []
  );

  return (
    <div>
      <TrendLegend series={series} onToggleSeries={id => setSeries(series.map(s =>
        s.id === id ? { ...s, visible: !s.visible } : s
      ))} />
      <TrendTimeRange range={range} onRangeChange={setRange} />
      {data.map(({ series: s, points }) => (
        <TrendChart
          key={s.id}
          data={points}
          width={800}
          height={250}
          color={s.color}
        />
      ))}
      <TrendExport onExport={format => console.log('Export', format)} />
    </div>
  );
}
```

### Components

#### TrendChart

SVG line chart with auto-scaled axes and grid.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `{ timestamp: string; value: number }[]` | required | Time series data points |
| `width` | `number` | required | SVG width in pixels |
| `height` | `number` | required | SVG height in pixels |
| `min` | `number?` | auto | Fixed Y-axis minimum |
| `max` | `number?` | auto | Fixed Y-axis maximum |
| `color` | `string?` | `#3b82f6` | Line and dot color |
| `showGrid` | `boolean?` | `true` | Toggle grid lines |

#### TrendLegend

Togglable series legend. Click a series to show/hide it.

| Prop | Type | Description |
|------|------|-------------|
| `series` | `SeriesItem[]` | Array of series definitions |
| `onToggleSeries` | `(seriesId: number) => void` | Called when a series is clicked |

```ts
interface SeriesItem {
  id: number;
  name: string;
  color: string;
  unit?: string;
  visible: boolean;
}
```

#### TrendTimeRange

Time range selector with preset buttons and optional custom range inputs.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `range` | `string` | required | Active range preset (`1h`, `4h`, `8h`, `24h`, `7d`, `custom`) |
| `onRangeChange` | `(range: string) => void` | required | Called when a preset is selected |
| `customStart` | `string?` | — | Custom start value |
| `customEnd` | `string?` | — | Custom end value |
| `onCustomRangeChange` | `(start, end) => void?` | — | Called when custom inputs change |

#### TrendCursor

SVG cursor overlay showing crosshairs and a tooltip with value and time.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `x` | `number` | required | Cursor X position (SVG coordinates) |
| `y` | `number` | required | Cursor Y position (SVG coordinates) |
| `visible` | `boolean` | required | Show/hide cursor |
| `value` | `number?` | — | Value displayed in tooltip |
| `timestamp` | `string?` | — | Timestamp displayed in tooltip |

#### TrendExport

Dropdown export button supporting CSV, JSON, and PNG formats.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onExport` | `(format: 'csv' \| 'json' \| 'png') => void` | required | Called with selected format |
| `exporting` | `boolean?` | `false` | Shows loading spinner |

### Styling

All components use Tailwind CSS utility classes. Since these packages ship pre-compiled JavaScript (not raw TSX), your Tailwind build process needs to be told where to scan for class names.

#### Tailwind CSS v4

In your CSS entry file, add an `@source` directive pointing to the package:

```css
@import "tailwindcss";
@source "../node_modules/@talos-sa/trending-react";
```

Replace `@talos-sa/trending-react` with whichever framework package you're using.

The source files (`src/`) are included in the published package, so Tailwind's scanner can find the class names.

#### Tailwind CSS v3

Add the package to the `content` array in `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@talos-sa/trending-react/**/*.{js,ts,jsx,tsx}",
  ],
}
```

The components expect a dark background (`bg-gray-950` or similar) to match their color scheme.

---

## Development

```bash
npm run build       # Build all packages
npm run dev         # Watch mode for all packages
npm run typecheck   # Type-check all packages
```
