import { createMemo, For, Show } from 'solid-js'

interface TrendTimeRangeProps {
  range: string
  onRangeChange: (range: string) => void
  customStart?: string
  customEnd?: string
  onCustomRangeChange?: (start: string, end: string) => void
}

const PRESETS = [
  { value: '1h', label: '1h' },
  { value: '4h', label: '4h' },
  { value: '8h', label: '8h' },
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: 'custom', label: 'Custom' },
]

export function TrendTimeRange(props: TrendTimeRangeProps) {
  const isCustom = createMemo(() => props.range === 'custom')
  const showCustom = createMemo(() => isCustom() && !!props.onCustomRangeChange)

  return (
    <div class="flex items-center gap-2">
      <div class="flex bg-gray-900 rounded-lg p-0.5 gap-0.5 border border-gray-800">
        <For each={PRESETS}>
          {preset => (
            <button
              onClick={() => props.onRangeChange(preset.value)}
              class={`px-3 py-1.5 text-xs rounded transition-colors ${
                props.range === preset.value
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }`}
            >
              {preset.label}
            </button>
          )}
        </For>
      </div>
      <Show when={showCustom()}>
        <div class="flex items-center gap-2">
          <input
            type="text"
            placeholder="Start"
            value={props.customStart ?? ''}
            onInput={e => props.onCustomRangeChange?.((e.target as HTMLInputElement).value, props.customEnd ?? '')}
            class="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
          />
          <span class="text-gray-500 text-xs">to</span>
          <input
            type="text"
            placeholder="End"
            value={props.customEnd ?? ''}
            onInput={e => props.onCustomRangeChange?.(props.customStart ?? '', (e.target as HTMLInputElement).value)}
            class="bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </Show>
    </div>
  )
}
