import type { ChartType } from '@/types/chart-config'

export interface CartesianDataPoint {
  name: string
  [key: string]: string | number
}

export interface PieDataPoint {
  name: string
  value: number
}

export interface ScatterDataPoint {
  x: number
  y: number
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

// Base values per month; additional series get deterministic random values
const baseValues: Record<string, number[]> = {
  series1: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
  series2: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
  series3: [1800, 2200, 2900, 2100, 3200, 2800, 2100],
}

function seededValues(seriesIndex: number): number[] {
  // Simple deterministic values for series beyond the first 3
  const seed = seriesIndex * 1337
  return months.map((_, i) => 1000 + ((seed + i * 997) % 4000))
}

export function getCartesianData(seriesKeys: string[]): CartesianDataPoint[] {
  return months.map((month, mi) => {
    const point: CartesianDataPoint = { name: month }
    seriesKeys.forEach((key, si) => {
      point[key] = baseValues[key]?.[mi] ?? seededValues(si)[mi]
    })
    return point
  })
}

export const pieSampleData: PieDataPoint[] = [
  { name: 'Electronics', value: 400 },
  { name: 'Clothing', value: 300 },
  { name: 'Food', value: 200 },
  { name: 'Books', value: 150 },
  { name: 'Other', value: 100 },
]

export const scatterSampleData: ScatterDataPoint[] = [
  { x: 100, y: 200 }, { x: 120, y: 100 }, { x: 170, y: 300 },
  { x: 140, y: 250 }, { x: 150, y: 400 }, { x: 110, y: 280 },
  { x: 160, y: 320 }, { x: 130, y: 180 }, { x: 180, y: 350 },
  { x: 190, y: 420 },
]

export function getSampleData(chartType: ChartType, seriesKeys?: string[]) {
  if (chartType === 'pie') return pieSampleData
  if (chartType === 'scatter') return scatterSampleData
  if (chartType === 'combo') return getCartesianData(seriesKeys ?? ['series1', 'series2', 'series3'])
  return getCartesianData(seriesKeys ?? ['series1', 'series2', 'series3'])
}
