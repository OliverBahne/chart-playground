import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SettingLabel } from './setting-label'

interface FigmaColorProps {
  label?: string
  color: string
  onChange: (color: string) => void
  tooltip?: string
  disabled?: boolean
  disabledReason?: string
}

export function FigmaColor({ label, color, onChange, tooltip, disabled, disabledReason }: FigmaColorProps) {
  return (
    <div className={`flex items-center gap-2 h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      {label && <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} />}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className="h-4 w-4 rounded-sm border border-border shrink-0 cursor-pointer"
            style={{ backgroundColor: color }}
          />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 space-y-2 bg-card border-border" align="start" side="left">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="w-40 h-40 cursor-pointer border-0 p-0 bg-transparent"
          />
          <input
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="figma-input w-full font-mono"
          />
        </PopoverContent>
      </Popover>
      <input
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="figma-input flex-1 min-w-0 font-mono"
      />
    </div>
  )
}
