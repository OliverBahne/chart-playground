import { Switch } from '@/components/ui/switch'
import { SettingLabel } from './setting-label'

interface LabeledSwitchProps {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  tooltip?: string
  disabled?: boolean
  disabledReason?: string
}

export function LabeledSwitch({ label, checked, onCheckedChange, tooltip, disabled, disabledReason }: LabeledSwitchProps) {
  return (
    <div className={`flex items-center justify-between h-7${disabled ? ' opacity-40 pointer-events-none' : ''}`}>
      <SettingLabel label={label} tooltip={tooltip} disabledReason={disabledReason} className="figma-label" />
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}
