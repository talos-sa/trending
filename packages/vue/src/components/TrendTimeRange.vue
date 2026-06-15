<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  range: string
  onRangeChange: (range: string) => void
  customStart?: string
  customEnd?: string
  onCustomRangeChange?: (start: string, end: string) => void
}>()

const PRESETS = [
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '8h', label: '8h' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: 'custom', label: 'Custom' },
]

const isCustom = computed(() => props.range === 'custom')
const showCustom = computed(() => isCustom.value && !!props.onCustomRangeChange)
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex bg-gray-900 rounded-lg p-0.5 gap-0.5 border border-gray-800">
      <button
        v-for="preset in PRESETS"
        :key="preset.value"
        @click="onRangeChange(preset.value)"
        :class="[
          'px-3 py-1.5 text-xs rounded transition-colors',
          range === preset.value
            ? 'bg-blue-500 text-white'
            : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
        ]"
      >
        {{ preset.label }}
      </button>
    </div>
    <div v-if="showCustom" class="flex items-center gap-2">
      <input
        type="text"
        placeholder="Start"
        :value="customStart ?? ''"
        @input="onCustomRangeChange?.((($event.target as HTMLInputElement).value), customEnd ?? '')"
        class="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
      />
      <span class="text-gray-500 text-xs">to</span>
      <input
        type="text"
        placeholder="End"
        :value="customEnd ?? ''"
        @input="onCustomRangeChange?.(customStart ?? '', (($event.target as HTMLInputElement).value))"
        class="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  </div>
</template>
