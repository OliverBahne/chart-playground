import type { ChartConfig } from '@/types/chart-config'

export interface BuiltInPreset {
  name: string
  config: ChartConfig
}

/**
 * Built-in presets shipped with the app.
 * These are always available regardless of localStorage.
 *
 * To add a preset:
 * 1. Configure the chart in the app
 * 2. Copy the JSON from the code view panel at the bottom
 * 3. Paste it here as a new entry
 */
export const BUILT_IN_PRESETS: BuiltInPreset[] = []
