import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SettingLabel } from './setting-label'

interface FigmaSelectProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  tooltip?: string
  disabled?: boolean
  disabledReason?: string
}

export function FigmaSelect({ label, value, options, onChange, tooltip, disabled, disabledReason }: FigmaSelectProps) {
  return (
    <div className={`flex items-center gap-2 h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} />
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger size="sm" className="!h-7 flex-1 bg-secondary border-none text-[11px] focus:ring-1 focus:ring-primary">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} className="text-[11px] py-1 min-h-7">{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
