import { Slider } from '@/components/ui/slider'
import { SettingLabel } from './setting-label'
import { useState } from 'react'

interface LabeledSliderProps {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onValueChange: (value: number) => void
  tooltip?: string
  disabled?: boolean
  disabledReason?: string
}

export function LabeledSlider({ label, value, min, max, step = 1, onValueChange, tooltip, disabled, disabledReason }: LabeledSliderProps) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')

  return (
    <div className={`flex items-center gap-2 h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} />
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onValueChange(v)}
        className="flex-1"
      />
      {editing ? (
        <input
          autoFocus
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onBlur={() => {
            const n = parseFloat(inputVal)
            if (!isNaN(n)) onValueChange(Math.min(max, Math.max(min, n)))
            setEditing(false)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
            if (e.key === 'Escape') setEditing(false)
          }}
          className="figma-input w-12 text-right tabular-nums"
        />
      ) : (
        <button
          onClick={() => { setInputVal(String(value)); setEditing(true) }}
          className="w-12 h-7 text-right text-[11px] tabular-nums text-foreground bg-transparent hover:bg-secondary rounded-md px-1 cursor-text"
        >
          {value}
        </button>
      )}
    </div>
  )
}
