import { Show } from 'solid-js'

interface TrendCursorProps {
  x: number
  y: number
  visible: boolean
  value?: number
  timestamp?: string
}

function formatTime(ts?: string): string {
  if (!ts) return ''
  try {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  } catch {
    return ts
  }
}

export function TrendCursor(props: TrendCursorProps) {
  return (
    <Show when={props.visible}>
      <g>
        <line x1={props.x} y1={0} x2={props.x} y2="100%" stroke="#6b7280" stroke-width="1" stroke-dasharray="4 2" />
        <line x1={0} y1={props.y} x2="100%" y2={props.y} stroke="#6b7280" stroke-width="1" stroke-dasharray="4 2" />
        <circle cx={props.x} cy={props.y} r={4} fill="#3b82f6" stroke="#fff" stroke-width="1.5" />
        <Show when={props.value !== undefined || props.timestamp}>
          <g transform={`translate(${props.x + 10}, ${props.y - 10})`}>
            <rect x={-4} y={-4} width={130} height={36} rx={4} fill="#111827" opacity={0.9} />
            <Show when={props.value !== undefined}>
              <text x={0} y={8} class="text-[10px] fill-gray-300">
                {typeof props.value === 'number' ? props.value.toFixed(2) : String(props.value)}
              </text>
            </Show>
            <Show when={props.timestamp}>
              <text x={0} y={22} class="text-[9px] fill-gray-500">
                {formatTime(props.timestamp)}
              </text>
            </Show>
          </g>
        </Show>
      </g>
    </Show>
  )
}
