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
  return (
    <div className={`flex items-center gap-2 h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
  disabled?: boolean
  disabledReason?: string
}

export function FigmaNumberInput({ label, value, onChange, min, max, step = 1, tooltip, disabled, disabledReason }: FigmaNumberInputProps) {
  return (
    <div className={`flex items-center gap-2 h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} />
      <input
        type="number"
        value={value}
        onChange={(e) => {
          let v = parseFloat(e.target.value)
          if (isNaN(v)) return
          if (min !== undefined) v = Math.max(min, v)
          if (max !== undefined) v = Math.min(max, v)
          onChange(v)
        }}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className="figma-input flex-1 min-w-0 tabular-nums text-right"
      />
    </div>
  )
}
