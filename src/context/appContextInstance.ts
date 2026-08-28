import { createContext } from 'react'
import type { ColorModeSetting, ColorVision, IconStyle, ResolvedColorMode } from '../constants'

export interface AppContextValue {
  duration: number
  setDuration: React.Dispatch<React.SetStateAction<number>>
  fadeOutSeconds: number
  setFadeOutSeconds: React.Dispatch<React.SetStateAction<number>>
  entriesText: string
  setEntriesText: React.Dispatch<React.SetStateAction<string>>
  spinWheelEnabled: boolean
  setSpinWheelEnabled: React.Dispatch<React.SetStateAction<boolean>>
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
  iconStyle: IconStyle
  setIconStyle: React.Dispatch<React.SetStateAction<IconStyle>>
  pickListOpen: boolean
  setPickListOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)
