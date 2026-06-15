# @talos-sa/trending-vue

Vue 3 components for time series data visualization. SVG-based charts, interactive legends, time range controls, cursor inspection, and export.

## Installation

```bash
npm install @talos-sa/trending-vue
```

Requires `vue` as a peer dependency.

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TrendChart, TrendLegend, TrendTimeRange, TrendExport } from '@talos-sa/trending-vue';

const series = ref([
  { id: 1, name: 'Temperature', color: '#ef4444', unit: '°C', visible: true },
  { id: 2, name: 'Pressure', color: '#3b82f6', unit: 'kPa', visible: true },
]);
</script>

<template>
  <TrendLegend :series="series" @toggle-series="id => {}" />
  <TrendTimeRange range="1h" @range-change="r => {}" />
  <TrendChart :data="[]" :width="800" :height="250" color="#3b82f6" />
  <TrendExport @export="format => console.log(format)" />
</template>
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
@source "../node_modules/@talos-sa/trending-vue";
```

### Tailwind CSS v3

```js
module.exports = {
  content: [
    "./src/**/*.{ts,tsx,vue}",
    "./node_modules/@talos-sa/trending-vue/**/*.{js,ts,jsx,tsx}",
  ],
}
```

## License

MIT
