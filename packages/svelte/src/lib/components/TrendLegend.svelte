<script lang="ts">
  let {
    series,
    onToggleSeries,
  }: {
    series: { id: number; name: string; color: string; unit?: string; visible: boolean }[]
    onToggleSeries: (seriesId: number) => void
  } = $props()
</script>

<div class="flex flex-wrap items-center gap-3">
  {#each series as item}
    <button
      onclick={() => onToggleSeries(item.id)}
      class="flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors {item.visible
        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
        : 'bg-gray-900 text-gray-500 line-through hover:bg-gray-800'}"
    >
      <span class="inline-block w-2.5 h-2.5 rounded-full shrink-0" style="background-color: {item.color}" />
      <span>{item.name}</span>
      {#if item.unit}
        <span class="text-gray-500">({item.unit})</span>
      {/if}
    </button>
  {/each}
</div>
