import { useState, type ReactNode } from 'react'
import { ChevronRight, Eye, EyeOff, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FigmaSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
  visible?: boolean
  onVisibleChange?: (v: boolean) => void
  onAdd?: () => void
}

export function FigmaSection({ title, children, defaultOpen = true, visible, onVisibleChange, onAdd }: FigmaSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border">
      <button
        className="flex items-center w-full px-3 py-1.5 hover:bg-accent/50 group"
        onClick={() => setOpen(!open)}
      >
        <ChevronRight className={cn('h-3 w-3 text-muted-foreground transition-transform mr-1', open && 'rotate-90')} />
        <span className="figma-section-title flex-1 text-left">{title}</span>
        {onVisibleChange && (
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => { e.stopPropagation(); onVisibleChange(!visible) }}
          >
            {visible ? <Eye className="h-3 w-3 text-muted-foreground" /> : <EyeOff className="h-3 w-3 text-muted-foreground" />}
          </span>
        )}
        {onAdd && (
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            onClick={(e) => { e.stopPropagation(); onAdd() }}
          >
            <Plus className="h-3 w-3 text-muted-foreground" />
          </span>
        )}
      </button>
      {open && (
        <div className="px-3 pb-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}
