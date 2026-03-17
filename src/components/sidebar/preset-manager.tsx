import { useState } from 'react'
import { Save, Trash2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { ChartConfig } from '@/types/chart-config'
import type { Preset } from '@/hooks/use-presets'

interface PresetManagerProps {
  presets: Preset[]
  onSave: (name: string, config: ChartConfig) => void
  onRemove: (name: string) => void
  onLoad: (config: ChartConfig) => void
  currentConfig: ChartConfig
}

export function PresetManager({ presets, onSave, onRemove, onLoad, currentConfig }: PresetManagerProps) {
  const [newName, setNewName] = useState('')
  const [selected, setSelected] = useState<string>('')

  const handleSave = () => {
    const name = newName.trim()
    if (!name) return
    onSave(name, currentConfig)
    setNewName('')
  }

  const handleLoad = (name: string) => {
    setSelected(name)
    const preset = presets.find((p) => p.name === name)
    if (preset) onLoad(preset.config)
  }

  const handleDelete = () => {
    if (!selected) return
    onRemove(selected)
    setSelected('')
  }

  return (
    <div className="border-b border-border px-3 py-2 space-y-1.5">
      <span className="figma-label block">Presets</span>

      {presets.length > 0 && (
        <div className="flex gap-1.5">
          <Select value={selected} onValueChange={handleLoad}>
            <SelectTrigger className="h-7 text-[11px] flex-1 bg-secondary border-none focus:ring-1 focus:ring-primary">
              <SelectValue placeholder="Load preset..." />
            </SelectTrigger>
            <SelectContent>
              {presets.map((p) => (
                <SelectItem key={p.name} value={p.name} className="text-[11px]">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selected && !presets.find((p) => p.name === selected)?.builtIn && (
            <button className="h-7 w-7 shrink-0 flex items-center justify-center hover:bg-accent/50 rounded" onClick={handleDelete}>
              <Trash2 className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-1.5">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Preset name"
          className="figma-input flex-1 min-w-0"
          onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
        />
        <button
          className="h-7 w-7 shrink-0 flex items-center justify-center hover:bg-accent/50 rounded disabled:opacity-40"
          onClick={handleSave}
          disabled={!newName.trim()}
        >
          <Save className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>
    </div>
  )
}
