<script setup lang="ts">
import { computed } from 'vue'

interface DataPoint {
  timestamp: string
  value: number
}

const props = defineProps<{
  data: DataPoint[]
  width: number
  height: number
  min?: number
  max?: number
  color?: string
  showGrid?: boolean
}>()

const padding = { top: 20, right: 20, bottom: 30, left: 60 }
const chartW = computed(() => props.width - padding.left - padding.right)
const chartH = computed(() => props.height - padding.top - padding.bottom)

const points = computed(() => {
  if (props.data.length === 0) return []
  const vals = props.data.map(d => d.value)
  const dMin = props.min ?? Math.min(...vals)
  const dMax = props.max ?? Math.max(...vals)
  const tsMin = new Date(props.data[0].timestamp).getTime()
  const tsMax = new Date(props.data[props.data.length - 1].timestamp).getTime()
  const range = dMax - dMin || 1
  const timeRange = tsMax - tsMin || 1
  return props.data.map(d => ({
    x: ((new Date(d.timestamp).getTime() - tsMin) / timeRange) * chartW.value,
    y: chartH.value - ((d.value - dMin) / range) * chartH.value,
  }))
})

const pathD = computed(() => {
  if (points.value.length === 0) return ''
  return points.value.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
})

const dataMin = computed(() => {
  if (props.data.length === 0) return 0
  return props.min ?? Math.min(...props.data.map(d => d.value))
})

const dataMax = computed(() => {
  if (props.data.length === 0) return 100
  return props.max ?? Math.max(...props.data.map(d => d.value))
})

const yTicks = computed(() => {
  const ticks = 5
  const result: { pos: number; label: string }[] = []
  for (let i = 0; i < ticks; i++) {
    const t = i / (ticks - 1)
    const value = dataMin.value + (dataMax.value - dataMin.value) * t
    result.push({ pos: chartH.value - t * chartH.value, label: value.toFixed(1) })
  }
  return result
})

const xTicks = computed(() => {
  if (props.data.length === 0) return []
  const ticks = 5
  const tsMin = new Date(props.data[0].timestamp).getTime()
  const tsMax = new Date(props.data[props.data.length - 1].timestamp).getTime()
  const result: { pos: number; label: string }[] = []
  for (let i = 0; i < ticks; i++) {
    const t = i / (ticks - 1)
    const value = tsMin + (tsMax - tsMin) * t
    result.push({ pos: t * chartW.value, label: new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
  }
  return result
})

const gridLines = computed(() => {
  if (!props.showGrid && props.showGrid !== undefined) return []
  const lines: { key: string; x1: number; y1: number; x2: number; y2: number }[] = []
  for (let i = 0; i < 5; i++) {
    const y = (i / 4) * chartH.value
    lines.push({ key: `gy${i}`, x1: 0, y1: y, x2: chartW.value, y2: y })
  }
  for (let i = 0; i < 5; i++) {
    const x = (i / 4) * chartW.value
    lines.push({ key: `gx${i}`, x1: x, y1: 0, x2: x, y2: chartH.value })
  }
  return lines
})
</script>

<template>
  <svg :width="width" :height="height" class="overflow-visible">
    <g :transform="`translate(${padding.left}, ${padding.top})`">
      <g v-for="tick in yTicks" :key="tick.pos">
        <line x1="0" :y1="tick.pos" :x2="chartW" :y2="tick.pos" stroke="#374151" stroke-width="1" />
        <text :x="-8" :y="tick.pos + 4" text-anchor="end" class="text-[10px] fill-gray-500">{{ tick.label }}</text>
      </g>
      <g v-for="tick in xTicks" :key="tick.pos">
        <line :x1="tick.pos" y1="0" :x2="tick.pos" :y2="chartH" stroke="#374151" stroke-width="1" />
        <text :x="tick.pos" :y="chartH + 14" text-anchor="middle" class="text-[10px] fill-gray-500">{{ tick.label }}</text>
      </g>
      <line v-for="gl in gridLines" :key="gl.key" :x1="gl.x1" :y1="gl.y1" :x2="gl.x2" :y2="gl.y2" stroke="#1f2937" stroke-width="1" />
      <path v-if="pathD" :d="pathD" fill="none" :stroke="color ?? '#3b82f6'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
      <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="2.5" :fill="color ?? '#3b82f6'" />
    </g>
  </svg>
</template>
