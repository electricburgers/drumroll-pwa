import { createContext } from 'react'
import type { ColorModeSetting, ColorVision, ResolvedColorMode } from '../constants'

export interface AppContextValue {
  duration: number
  setDuration: React.Dispatch<React.SetStateAction<number>>
  openSettings: boolean
  setOpenSettings: React.Dispatch<React.SetStateAction<boolean>>
  isRolling: boolean
  setIsRolling: React.Dispatch<React.SetStateAction<boolean>>
  defaultGridSpacing: number
  colorMode: ColorModeSetting
  setColorMode: React.Dispatch<React.SetStateAction<ColorModeSetting>>
  resolvedColorMode: ResolvedColorMode
  colorVision: ColorVision
  setColorVision: React.Dispatch<React.SetStateAction<ColorVision>>
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)
