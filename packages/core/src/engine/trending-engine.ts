import type { DataPoint, TimeSeries } from '../types/trending';
import type { DataQuality } from '../types/quality';

class RingBuffer<T> {
  private buffer: (T | undefined)[];
  private head = 0;
  private count = 0;
  private capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    this.count = Math.min(this.count + 1, this.capacity);
  }

  toArray(): T[] {
    const result: T[] = [];
    const start = this.count < this.capacity ? 0 : this.head;
    const len = Math.min(this.count, this.capacity);

    for (let i = 0; i < len; i++) {
      const idx = (start + i) % this.capacity;
      const item = this.buffer[idx];
      if (item !== undefined) {
        result.push(item);
      }
    }

    return result;
  }

  get length(): number { return this.count; }
}

export class TrendingEngine {
  private buffers: Map<number, RingBuffer<DataPoint>> = new Map();
  private maxPointsPerBuffer: number;

  constructor(maxPointsPerBuffer = 3600) {
    this.maxPointsPerBuffer = maxPointsPerBuffer;
  }

  record(seriesId: number, value: number, quality: DataQuality, timestamp: string): void {
    let buf = this.buffers.get(seriesId);
    if (!buf) {
      buf = new RingBuffer<DataPoint>(this.maxPointsPerBuffer);
      this.buffers.set(seriesId, buf);
    }

    buf.push({ timestamp, value, quality });
  }

  recordBatch(dataPoints: Array<{ seriesId: number; value: number; quality: DataQuality; timestamp: string }>): void {
    for (const dp of dataPoints) {
      this.record(dp.seriesId, dp.value, dp.quality, dp.timestamp);
    }
  }

  getTimeSeries(seriesId: number, startTime?: string, endTime?: string): TimeSeries {
    const buf = this.buffers.get(seriesId);
    if (!buf) {
      return { id: seriesId, name: `Series_${seriesId}`, unit: '', points: [], min: 0, max: 0 };
    }

    let points = buf.toArray();

    if (startTime) {
      const start = new Date(startTime).getTime();
      points = points.filter(p => new Date(p.timestamp).getTime() >= start);
    }
    if (endTime) {
      const end = new Date(endTime).getTime();
      points = points.filter(p => new Date(p.timestamp).getTime() <= end);
    }

    const values = points.filter(p => typeof p.value === 'number').map(p => p.value as number);
    const min = values.length > 0 ? Math.min(...values) : 0;
    const max = values.length > 0 ? Math.max(...values) : 0;

    return {
      id: seriesId,
      name: `Series_${seriesId}`,
      unit: '',
      points,
      min,
      max,
    };
  }

  getDownsampled(seriesId: number, startTime: string, endTime: string, maxPoints: number): TimeSeries {
    const series = this.getTimeSeries(seriesId, startTime, endTime);

    if (series.points.length <= maxPoints) {
      return series;
    }

    const bucketSize = Math.ceil(series.points.length / maxPoints);
    const downsampled: DataPoint[] = [];

    for (let i = 0; i < series.points.length; i += bucketSize) {
      const bucket = series.points.slice(i, i + bucketSize);
      const avg = bucket.reduce((sum, p) => sum + (p.value as number), 0) / bucket.length;
      downsampled.push({
        timestamp: bucket[0].timestamp,
        value: avg,
        quality: bucket[0].quality,
      });
    }

    const values = downsampled.filter(p => typeof p.value === 'number').map(p => p.value as number);

    return {
      ...series,
      points: downsampled,
      min: values.length > 0 ? Math.min(...values) : 0,
      max: values.length > 0 ? Math.max(...values) : 0,
    };
  }

  clearBuffer(seriesId: number): void {
    this.buffers.delete(seriesId);
  }

  clearAllBuffers(): void {
    this.buffers.clear();
  }
}
