<script lang="ts">
  let {
    data,
    width,
    height,
    min,
    max,
    color = '#3b82f6',
    showGrid = true,
  }: {
    data: { timestamp: string; value: number }[]
    width: number
    height: number
    min?: number
    max?: number
    color?: string
    showGrid?: boolean
  } = $props()

  const padding = { top: 20, right: 20, bottom: 30, left: 60 }
  const chartW = $derived(width - padding.left - padding.right)
  const chartH = $derived(height - padding.top - padding.bottom)

  const points = $derived.by(() => {
    if (data.length === 0) return []
    const vals = data.map(d => d.value)
    const dMin = min ?? Math.min(...vals)
    const dMax = max ?? Math.max(...vals)
    const tsMin = new Date(data[0].timestamp).getTime()
    const tsMax = new Date(data[data.length - 1].timestamp).getTime()
    const range = dMax - dMin || 1
    const timeRange = tsMax - tsMin || 1
    return data.map(d => ({
      x: ((new Date(d.timestamp).getTime() - tsMin) / timeRange) * chartW,
      y: chartH - ((d.value - dMin) / range) * chartH,
    }))
  })

  const pathD = $derived(
    points.length === 0 ? '' : points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  )

  const yTicks = $derived.by(() => {
    if (data.length === 0) return []
    const dMin = min ?? Math.min(...data.map(d => d.value))
    const dMax = max ?? Math.max(...data.map(d => d.value))
    const result: { pos: number; label: string }[] = []
    for (let i = 0; i < 5; i++) {
      const t = i / 4
      const value = dMin + (dMax - dMin) * t
      result.push({ pos: chartH - t * chartH, label: value.toFixed(1) })
    }
    return result
  })

  const xTicks = $derived.by(() => {
    if (data.length === 0) return []
    const tsMin = new Date(data[0].timestamp).getTime()
    const tsMax = new Date(data[data.length - 1].timestamp).getTime()
    const result: { pos: number; label: string }[] = []
    for (let i = 0; i < 5; i++) {
      const t = i / 4
      const value = tsMin + (tsMax - tsMin) * t
      result.push({ pos: t * chartW, label: new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
    }
    return result
  })

  const gridLines = $derived.by(() => {
    if (!showGrid) return []
    const lines: { key: string; x1: number; y1: number; x2: number; y2: number }[] = []
    for (let i = 0; i < 5; i++) {
      const y = (i / 4) * chartH
      lines.push({ key: `gy${i}`, x1: 0, y1: y, x2: chartW, y2: y })
    }
    for (let i = 0; i < 5; i++) {
      const x = (i / 4) * chartW
      lines.push({ key: `gx${i}`, x1: x, y1: 0, x2: x, y2: chartH })
    }
    return lines
  })
</script>

<svg {width} {height} class="overflow-visible">
  <g transform="translate({padding.left}, {padding.top})">
    {#each yTicks as tick}
      <line x1={0} y1={tick.pos} x2={chartW} y2={tick.pos} stroke="#374151" stroke-width="1" />
      <text x={-8} y={tick.pos + 4} text-anchor="end" class="text-[10px] fill-gray-500">{tick.label}</text>
    {/each}
    {#each xTicks as tick}
      <line x1={tick.pos} y1={0} x2={tick.pos} y2={chartH} stroke="#374151" stroke-width="1" />
      <text x={tick.pos} y={chartH + 14} text-anchor="middle" class="text-[10px] fill-gray-500">{tick.label}</text>
    {/each}
    {#if showGrid}
      {#each gridLines as gl}
        <line x1={gl.x1} y1={gl.y1} x2={gl.x2} y2={gl.y2} stroke="#1f2937" stroke-width="1" />
      {/each}
    {/if}
    {#if pathD}
      <path d={pathD} fill="none" stroke={color} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    {/if}
    {#each points as p, i}
      <circle cx={p.x} cy={p.y} r={2.5} fill={color} />
    {/each}
  </g>
</svg>
