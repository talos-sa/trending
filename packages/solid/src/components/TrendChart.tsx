import { createMemo, For, Show } from 'solid-js'

interface TrendChartProps {
  data: { timestamp: string; value: number }[]
  width: number
  height: number
  min?: number
  max?: number
  color?: string
  showGrid?: boolean
}

function buildPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return ''
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
}

export function TrendChart(props: TrendChartProps) {
  const padding = { top: 20, right: 20, bottom: 30, left: 60 }
  const chartW = () => props.width - padding.left - padding.right
  const chartH = () => props.height - padding.top - padding.bottom

  const points = createMemo(() => {
    if (props.data.length === 0) return []
    const vals = props.data.map(d => d.value)
    const dMin = props.min ?? Math.min(...vals)
    const dMax = props.max ?? Math.max(...vals)
    const tsMin = new Date(props.data[0].timestamp).getTime()
    const tsMax = new Date(props.data[props.data.length - 1].timestamp).getTime()
    const range = dMax - dMin || 1
    const timeRange = tsMax - tsMin || 1
    return props.data.map(d => ({
      x: ((new Date(d.timestamp).getTime() - tsMin) / timeRange) * chartW(),
      y: chartH() - ((d.value - dMin) / range) * chartH(),
    }))
  })

  const pathD = createMemo(() => buildPath(points()))

  const dataMin = createMemo(() => {
    if (props.data.length === 0) return 0
    return props.min ?? Math.min(...props.data.map(d => d.value))
  })

  const dataMax = createMemo(() => {
    if (props.data.length === 0) return 100
    return props.max ?? Math.max(...props.data.map(d => d.value))
  })

  const yTicks = createMemo(() => {
    const result: { pos: number; label: string }[] = []
    for (let i = 0; i < 5; i++) {
      const t = i / 4
      const value = dataMin() + (dataMax() - dataMin()) * t
      result.push({ pos: chartH() - t * chartH(), label: value.toFixed(1) })
    }
    return result
  })

  const xTicks = createMemo(() => {
    if (props.data.length === 0) return []
    const result: { pos: number; label: string }[] = []
    const tsMin = new Date(props.data[0].timestamp).getTime()
    const tsMax = new Date(props.data[props.data.length - 1].timestamp).getTime()
    for (let i = 0; i < 5; i++) {
      const t = i / 4
      const value = tsMin + (tsMax - tsMin) * t
      result.push({ pos: t * chartW(), label: new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
    }
    return result
  })

  const gridLines = createMemo(() => {
    const lines: { key: string; x1: number; y1: number; x2: number; y2: number }[] = []
    for (let i = 0; i < 5; i++) {
      const y = (i / 4) * chartH()
      lines.push({ key: `gy${i}`, x1: 0, y1: y, x2: chartW(), y2: y })
    }
    for (let i = 0; i < 5; i++) {
      const x = (i / 4) * chartW()
      lines.push({ key: `gx${i}`, x1: x, y1: 0, x2: x, y2: chartH() })
    }
    return lines
  })

  const color = () => props.color ?? '#3b82f6'

  return (
    <svg width={props.width} height={props.height} class="overflow-visible">
      <g transform={`translate(${padding.left}, ${padding.top})`}>
        <For each={yTicks()}>
          {tick => (
            <g>
              <line x1={0} y1={tick.pos} x2={chartW()} y2={tick.pos} stroke="#374151" stroke-width="1" />
              <text x={-8} y={tick.pos + 4} text-anchor="end" class="text-[10px] fill-gray-500">{tick.label}</text>
            </g>
          )}
        </For>
        <For each={xTicks()}>
          {tick => (
            <g>
              <line x1={tick.pos} y1={0} x2={tick.pos} y2={chartH()} stroke="#374151" stroke-width="1" />
              <text x={tick.pos} y={chartH() + 14} text-anchor="middle" class="text-[10px] fill-gray-500">{tick.label}</text>
            </g>
          )}
        </For>
        <Show when={props.showGrid}>
          <For each={gridLines()}>
            {gl => <line x1={gl.x1} y1={gl.y1} x2={gl.x2} y2={gl.y2} stroke="#1f2937" stroke-width="1" />}
          </For>
        </Show>
        <Show when={pathD()}>
          <path d={pathD()} fill="none" stroke={color()} stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
        </Show>
        <For each={points()}>
          {(p, i) => <circle cx={p.x} cy={p.y} r={2.5} fill={color()} />}
        </For>
      </g>
    </svg>
  )
}
