import { useState, useCallback } from 'react'
import type { ChartConfig } from '@/types/chart-config'
import { BUILT_IN_PRESETS } from '@/data/built-in-presets'

export interface Preset {
  name: string
  config: ChartConfig
  builtIn?: boolean
}

const STORAGE_KEY = 'chart-playground-presets'

function loadFromStorage(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(presets: Preset[]) {
  // Only persist user presets (not built-in)
  const userOnly = presets.filter((p) => !p.builtIn)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnly))
}

function mergePresets(userPresets: Preset[]): Preset[] {
  const builtIn: Preset[] = BUILT_IN_PRESETS.map((p) => ({ ...p, builtIn: true }))
  // User presets with the same name override built-in ones
  const userNames = new Set(userPresets.map((p) => p.name))
  const uniqueBuiltIn = builtIn.filter((p) => !userNames.has(p.name))
  return [...uniqueBuiltIn, ...userPresets]
}

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>(() => mergePresets(loadFromStorage()))

  const save = useCallback((name: string, config: ChartConfig) => {
    setPresets((prev) => {
      const existing = prev.findIndex((p) => p.name === name)
      const updated = [...prev]
      if (existing >= 0) {
        updated[existing] = { name, config }
      } else {
        updated.push({ name, config })
      }
      saveToStorage(updated)
      return updated
    })
  }, [])

  const remove = useCallback((name: string) => {
    setPresets((prev) => {
      const updated = prev.filter((p) => p.name !== name)
      saveToStorage(updated)
      return updated
    })
  }, [])

  return { presets, save, remove }
}
