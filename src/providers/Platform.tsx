import { createContext, ReactChild, ReactElement, useState, useEffect } from 'react'

export enum ALL_PLATFORMS {
  macOS = 0,
  Linux,
  Windows,
  iOS,
  Android,
}

export enum SUPPORTED_PLATFORMS {
  macOS = 0,
  Linux,
}

interface ContextInterface {
  platform: SUPPORTED_PLATFORMS
  setPlatform: (platform: SUPPORTED_PLATFORMS) => void
}

const initialValues: ContextInterface = {
  platform: SUPPORTED_PLATFORMS.macOS,
  setPlatform: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

function isSupportedPlatform(platform: unknown): platform is SUPPORTED_PLATFORMS {
  return Object.keys(SUPPORTED_PLATFORMS).includes(platform as string)
}

function getOS(): ALL_PLATFORMS | null {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']

  if (macosPlatforms.includes(platform)) return ALL_PLATFORMS.macOS

  if (iosPlatforms.includes(platform)) return ALL_PLATFORMS.iOS

  if (windowsPlatforms.includes(platform)) return ALL_PLATFORMS.Windows

  if (/Android/.test(userAgent)) return ALL_PLATFORMS.Android

  if (/Linux/.test(platform)) return ALL_PLATFORMS.Linux

  return null
}

export function Provider({ children }: Props): ReactElement {
  const [platform, setPlatform] = useState<SUPPORTED_PLATFORMS>(SUPPORTED_PLATFORMS.Linux)

  // This is in useEffect as it really just needs to run once and not on each re-render
  useEffect(() => {
    const os = getOS()

    setPlatform(isSupportedPlatform(os) ? os : SUPPORTED_PLATFORMS.Linux)
  }, [])

  return <Context.Provider value={{ platform, setPlatform }}>{children}</Context.Provider>
}
