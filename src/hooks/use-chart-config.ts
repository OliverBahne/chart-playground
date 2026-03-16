import { useReducer } from 'react'
import type { ChartConfig, ChartType } from '@/types/chart-config'
import { DEFAULT_CONFIG, PALETTE, makeLineSeries, makeAreaSeries, makeBarSeries, makeScatterSeries } from '@/constants/defaults'

type ConfigAction =
  | { type: 'SET_CHART_TYPE'; payload: ChartType }
  | { type: 'LOAD_CONFIG'; payload: ChartConfig }
  | { type: 'UPDATE'; path: string; payload: unknown }
  | { type: 'UPDATE_SERIES'; seriesType: string; index: number; path: string; payload: unknown }
  | { type: 'ADD_SERIES'; seriesType: string }
  | { type: 'REMOVE_SERIES'; seriesType: string; index: number }
  | { type: 'ADD_REFERENCE_LINE' }
  | { type: 'REMOVE_REFERENCE_LINE'; index: number }
  | { type: 'ADD_REFERENCE_AREA' }
  | { type: 'REMOVE_REFERENCE_AREA'; index: number }

function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.')
  if (keys.length === 1) {
    return { ...obj, [keys[0]]: value }
  }
  const [first, ...rest] = keys
  return {
    ...obj,
    [first]: setNestedValue(
      (obj[first] as Record<string, unknown>) ?? {},
      rest.join('.'),
      value
    ),
  }
}

function createSeries(seriesType: string, index: number) {
  const dataKey = `series${index}`
  const name = `Series ${index}`
  const color = PALETTE[(index - 1) % PALETTE.length]

  switch (seriesType) {
    case 'lineSeries': return makeLineSeries(dataKey, name, color)
    case 'areaSeries': return makeAreaSeries(dataKey, name, color)
    case 'barSeries': return makeBarSeries(dataKey, name, color)
    case 'scatterSeries': return makeScatterSeries(name, color)
    default: return null
  }
}

function configReducer(state: ChartConfig, action: ConfigAction): ChartConfig {
  switch (action.type) {
    case 'SET_CHART_TYPE': {
      const next = { ...state, chartType: action.payload }
      // Seed combo with 1 bar + 1 line if arrays are empty
      if (action.payload === 'combo') {
        if (next.barSeries.length === 0) {
          next.barSeries = [makeBarSeries('series1', 'Bar 1', PALETTE[0])]
        }
        if (next.lineSeries.length === 0) {
          next.lineSeries = [makeLineSeries('series2', 'Line 1', PALETTE[1])]
        }
      }
      return next
    }

    case 'LOAD_CONFIG':
      return action.payload

    case 'UPDATE': {
      return setNestedValue(
        state as unknown as Record<string, unknown>,
        action.path,
        action.payload
      ) as unknown as ChartConfig
    }

    case 'UPDATE_SERIES': {
      const { seriesType, index, path, payload } = action
      const key = seriesType as keyof ChartConfig
      const arr = [...(state[key] as unknown[])]
      if (path) {
        arr[index] = setNestedValue(
          arr[index] as Record<string, unknown>,
          path,
          payload
        )
      } else {
        arr[index] = payload
      }
      return { ...state, [key]: arr }
    }

    case 'ADD_SERIES': {
      const { seriesType } = action
      const key = seriesType as keyof ChartConfig
      const arr = [...(state[key] as unknown[])]
      const nextIndex = arr.length + 1
      const newSeries = createSeries(seriesType, nextIndex)
      if (!newSeries) return state
      return { ...state, [key]: [...arr, newSeries] }
    }

    case 'REMOVE_SERIES': {
      const { seriesType, index } = action
      const key = seriesType as keyof ChartConfig
      const arr = (state[key] as unknown[]).filter((_, i) => i !== index)
      if (arr.length === 0) return state // keep at least one
      return { ...state, [key]: arr }
    }

    case 'ADD_REFERENCE_LINE':
      return {
        ...state,
        referenceLines: [
          ...state.referenceLines,
          {
            id: `ref-${Date.now()}`,
            axis: 'y',
            value: 5000,
            stroke: '#ff4444',
            strokeWidth: 1,
            strokeDasharray: '5 5',
            label: 'Ref',
            labelPosition: 'insideRight',
            ifOverflow: 'extendDomain',
          },
        ],
      }

    case 'REMOVE_REFERENCE_LINE':
      return {
        ...state,
        referenceLines: state.referenceLines.filter((_, i) => i !== action.index),
      }

    case 'ADD_REFERENCE_AREA':
      return {
        ...state,
        referenceAreas: [
          ...state.referenceAreas,
          {
            id: `area-${Date.now()}`,
            x1: 'Feb',
            x2: 'Apr',
            y1: '',
            y2: '',
            fill: '#8884d8',
            fillOpacity: 0.1,
            stroke: 'none',
            strokeWidth: 0,
            label: '',
            ifOverflow: 'extendDomain',
          },
        ],
      }

    case 'REMOVE_REFERENCE_AREA':
      return {
        ...state,
        referenceAreas: state.referenceAreas.filter((_, i) => i !== action.index),
      }

    default:
      return state
  }
}

export function useChartConfig() {
  const [config, dispatch] = useReducer(configReducer, DEFAULT_CONFIG)

  const update = (path: string, value: unknown) =>
    dispatch({ type: 'UPDATE', path, payload: value })

  const updateSeries = (seriesType: string, index: number, path: string, value: unknown) =>
    dispatch({ type: 'UPDATE_SERIES', seriesType, index, path, payload: value })

  return { config, dispatch, update, updateSeries }
}

export type { ConfigAction }
