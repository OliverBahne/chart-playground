import { useState, useCallback } from 'react'
import type { ChartConfig } from '@/types/chart-config'

interface Preset {
  name: string
  config: ChartConfig
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
}

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>(loadFromStorage)

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
