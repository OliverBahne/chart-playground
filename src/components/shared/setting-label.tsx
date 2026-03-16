import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface SettingLabelProps {
  label: string
  tooltip?: string
  disabledReason?: string
  className?: string
}

export function SettingLabel({ label, tooltip, disabledReason, className = 'figma-label min-w-[72px] shrink-0' }: SettingLabelProps) {
  const tip = disabledReason || tooltip
  if (!tip) {
    return <span className={className}>{label}</span>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`${className} pointer-events-auto`}>
          <span className="cursor-help border-b border-dotted border-muted-foreground/40">{label}</span>
        </span>
      </TooltipTrigger>
      <TooltipContent side="left" className="max-w-[200px] text-[11px]">
        {tip}
      </TooltipContent>
    </Tooltip>
  )
}
