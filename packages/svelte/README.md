# @talos-sa/trending-svelte

Svelte components for time series data visualization. SVG-based charts, interactive legends, time range controls, cursor inspection, and export.

## Installation

```bash
npm install @talos-sa/trending-svelte
```

Requires `svelte` as a peer dependency.

## Usage

```svelte
<script lang="ts">
import { TrendChart, TrendLegend, TrendTimeRange, TrendExport } from '@talos-sa/trending-svelte';

let series = [
  { id: 1, name: 'Temperature', color: '#ef4444', unit: '°C', visible: true },
  { id: 2, name: 'Pressure', color: '#3b82f6', unit: 'kPa', visible: true },
];
</script>

<TrendLegend bind:series />
<TrendTimeRange range="1h" onRangeChange={r => {}} />
<TrendChart data={[]} width={800} height={250} color="#3b82f6" />
<TrendExport onExport={format => console.log(format)} />
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
@source "../node_modules/@talos-sa/trending-svelte";
```

### Tailwind CSS v3

```js
module.exports = {
  content: [
    "./src/**/*.{ts,svelte}",
    "./node_modules/@talos-sa/trending-svelte/**/*.{js,ts}",
  ],
}
```

## License

MIT
