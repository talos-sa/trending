<script lang="ts">
  let {
    range,
    onRangeChange,
    customStart = '',
    customEnd = '',
    onCustomRangeChange,
  }: {
    range: string
    onRangeChange: (range: string) => void
    customStart?: string
    customEnd?: string
    onCustomRangeChange?: (start: string, end: string) => void
  } = $props()

  const PRESETS = [
    { value: '1h', label: '1h' },
    { value: '4h', label: '4h' },
    { value: '8h', label: '8h' },
    { value: '24h', label: '24h' },
    { value: '7d', label: '7d' },
    { value: 'custom', label: 'Custom' },
  ]

  const isCustom = $derived(range === 'custom')
</script>

<div class="flex items-center gap-2">
  <div class="flex bg-gray-900 rounded-lg p-0.5 gap-0.5 border border-gray-800">
    {#each PRESETS as preset}
      <button
        onclick={() => onRangeChange(preset.value)}
        class="px-3 py-1.5 text-xs rounded transition-colors {range === preset.value
          ? 'bg-blue-500 text-white'
          : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}"
      >
        {preset.label}
      </button>
    {/each}
  </div>
  {#if isCustom && onCustomRangeChange}
    <div class="flex items-center gap-2">
      <input
        type="text"
        placeholder="Start"
        value={customStart}
        oninput={(e) => onCustomRangeChange((e.target as HTMLInputElement).value, customEnd ?? '')}
        class="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
      />
      <span class="text-gray-500 text-xs">to</span>
      <input
        type="text"
        placeholder="End"
        value={customEnd}
        oninput={(e) => onCustomRangeChange(customStart ?? '', (e.target as HTMLInputElement).value)}
        class="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
      />
    </div>
  {/if}
</div>
