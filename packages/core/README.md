# @talos-sa/trending-core

Pure TypeScript engine and types for time series data processing. Framework-agnostic — works in Node, browsers, and any UI framework.

## Installation

```bash
npm install @talos-sa/trending-core
```

## Usage

```ts
import { TrendingEngine } from '@talos-sa/trending-core';

const engine = new TrendingEngine(3600);

engine.record(1, 72.5, 'good', new Date().toISOString());
engine.record(2, 101.3, 'good', new Date().toISOString());

const series = engine.getTimeSeries(1);
const downsampled = engine.getDownsampled(1, startTime, endTime, 500);
```

## API

| Method | Description |
|--------|-------------|
| `record(seriesId, value, quality, timestamp)` | Record a single data point |
| `recordBatch(dataPoints[])` | Record multiple points at once |
| `getTimeSeries(seriesId, start?, end?)` | Get all points for a series |
| `getDownsampled(seriesId, start, end, maxPoints)` | Get downsampled points for rendering |
| `clearBuffer(seriesId)` | Clear data for a specific series |
| `clearAllBuffers()` | Clear all stored data |

## Types

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
```

## License

MIT
