import { useState, useEffect } from 'react'
import { SettingLabel } from './setting-label'

interface FigmaTextInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  tooltip?: string
  disabled?: boolean
  disabledReason?: string
}

export function FigmaTextInput({ label, value, onChange, placeholder, tooltip, disabled, disabledReason }: FigmaTextInputProps) {
  const [draft, setDraft] = useState(value)
  useEffect(() => { setDraft(value) }, [value])

  const commit = () => {
    if (draft !== value) onChange(draft)
  }

  return (
    <div className={`flex items-center gap-2 h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} />
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { commit(); (e.target as HTMLInputElement).blur() } }}
        placeholder={placeholder}
        disabled={disabled}
        className="figma-input flex-1 min-w-0"
      />
    </div>
  )
}

interface FigmaNumberInputProps {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  tooltip?: string
  placeholder?: string
  disabled?: boolean
  disabledReason?: string
}

export function FigmaNumberInput({ label, value, onChange, min, max, step = 1, tooltip, placeholder, disabled, disabledReason }: FigmaNumberInputProps) {
  const displayValue = value != null && !isNaN(value) ? String(value) : ''
  const [draft, setDraft] = useState(displayValue)
  useEffect(() => { setDraft(displayValue) }, [displayValue])

  const commit = () => {
    let v = parseFloat(draft)
    if (isNaN(v)) { setDraft(displayValue); return }
    if (min !== undefined) v = Math.max(min, v)
    if (max !== undefined) v = Math.min(max, v)
    onChange(v)
  }

  return (
    <div className={`flex items-center gap-2 h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} />
      <input
        type="number"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') { commit(); (e.target as HTMLInputElement).blur() } }}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className="figma-input flex-1 min-w-0 tabular-nums text-left"
      />
    </div>
  )
}
