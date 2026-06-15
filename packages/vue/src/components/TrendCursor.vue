<script setup lang="ts">
defineProps<{
  x: number
  y: number
  visible: boolean
  value?: number
  timestamp?: string
}>()

function formatTime(ts?: string): string {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return ts
  }
}
</script>

<template>
  <g v-if="visible">
    <line :x1="x" y1="0" :x2="x" y2="100%" stroke="#6b7280" stroke-width="1" stroke-dasharray="4 2" />
    <line x1="0" :y1="y" x2="100%" :y2="y" stroke="#6b7280" stroke-width="1" stroke-dasharray="4 2" />
    <circle :cx="x" :cy="y" r="4" fill="#3b82f6" stroke="#fff" stroke-width="1.5" />
    <g v-if="value !== undefined || timestamp" :transform="`translate(${x + 10}, ${y - 10})`">
      <rect x="-4" y="-4" width="130" height="36" rx="4" fill="#111827" opacity="0.9" />
      <text v-if="value !== undefined" x="0" y="8" class="text-[10px] fill-gray-300">
        {{ typeof value === 'number' ? value.toFixed(2) : String(value) }}
      </text>
      <text v-if="timestamp" x="0" y="22" class="text-[9px] fill-gray-500">
        {{ formatTime(timestamp) }}
      </text>
    </g>
  </g>
</template>
