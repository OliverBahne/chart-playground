import { useState } from 'react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronRight, Copy, Check } from 'lucide-react'
import type { ChartConfig } from '@/types/chart-config'

interface ConfigCodeViewProps {
  config: ChartConfig
}

export function ConfigCodeView({ config }: ConfigCodeViewProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const json = JSON.stringify(config, null, 2)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <div className="flex items-center justify-between px-3 py-1.5">
        <CollapsibleTrigger className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className={`h-3 w-3 transition-transform ${open ? 'rotate-90' : ''}`} />
          Config JSON
        </CollapsibleTrigger>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-accent transition-colors"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <CollapsibleContent>
        <pre className="px-3 pb-3 text-[10px] font-mono overflow-auto max-h-64 text-muted-foreground leading-relaxed">
          {json}
        </pre>
      </CollapsibleContent>
    </Collapsible>
  )
}
