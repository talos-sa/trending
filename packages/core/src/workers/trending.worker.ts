self.onmessage = (event: MessageEvent) => {
  const { command, data } = event.data;

  switch (command) {
    case 'downsample': {
      const { points, maxPoints } = data;

      if (!points || points.length <= maxPoints) {
        self.postMessage({ type: 'downsampled', data: points ?? [] });
        return;
      }

      const bucketSize = Math.ceil(points.length / maxPoints);
      const result: Array<{ timestamp: string; value: number; quality: string }> = [];

      for (let i = 0; i < points.length; i += bucketSize) {
        const bucket = points.slice(i, i + bucketSize);
        const avg = bucket.reduce((sum: number, p: { value: number }) => sum + p.value, 0) / bucket.length;
        result.push({
          timestamp: bucket[0].timestamp,
          value: avg,
          quality: bucket[0].quality,
        });
      }

      self.postMessage({ type: 'downsampled', data: result });
      break;
    }

    case 'analyze': {
      const { seriesId, points } = data;
      const values = (points ?? []).map((p: { value: number }) => p.value);
      const min = values.length > 0 ? Math.min(...values) : 0;
      const max = values.length > 0 ? Math.max(...values) : 0;
      const avg = values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0;

      self.postMessage({
        type: 'analysis',
        data: { seriesId, min, max, avg, count: values.length },
      });
      break;
    }
  }
};
