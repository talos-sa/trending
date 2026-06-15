<script lang="ts">
  let {
    onExport,
    exporting = false,
  }: {
    onExport: (format: 'csv' | 'json' | 'png') => void
    exporting?: boolean
  } = $props()

  const FORMATS: { value: 'csv' | 'json' | 'png'; label: string }[] = [
    { value: 'csv', label: 'CSV' },
    { value: 'json', label: 'JSON' },
    { value: 'png', label: 'PNG' },
  ]

  let open = $state(false)
</script>

<svelte:window onmousedown={(e) => {
  const el = document.getElementById('trend-export')
  if (el && !el.contains(e.target as Node)) open = false
}} />

<div id="trend-export" class="relative inline-block">
  <button
    disabled={exporting}
    onclick={() => open = !open}
    class="inline-flex items-center justify-center gap-2 rounded-md transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {#if exporting}
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    {:else}
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    {/if}
    Export
  </button>
  {#if open}
    <div class="absolute right-0 top-full mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[120px] py-1">
      {#each FORMATS as f}
        <button
          onclick={() => { onExport(f.value); open = false }}
          class="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
        >
          {f.label}
        </button>
      {/each}
    </div>
  {/if}
</div>
