import type { DataQuality } from './quality';

export interface DataPoint {
  timestamp: string;
  value: number;
  quality: DataQuality;
}

export interface TimeSeries {
  id: number;
  name: string;
  unit: string;
  points: DataPoint[];
  min: number;
  max: number;
}

export interface TrendViewport {
  startTime: string;
  endTime: string;
  visibleDuration: number;
}
