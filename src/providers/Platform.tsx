import { createContext, ReactChild, ReactElement, useState, useEffect } from 'react'

// These need to be numeric values as they are used as indexes in the TabsContainer
export enum Platforms {
  macOS = 0,
  Linux,
  Windows,
  iOS,
  Android,
}

export enum SupportedPlatforms {
  macOS = Platforms.macOS,
  Linux = Platforms.Windows,
}

interface ContextInterface {
  platform: SupportedPlatforms
  setPlatform: (platform: SupportedPlatforms) => void
}

const initialValues: ContextInterface = {
  platform: SupportedPlatforms.macOS,
  setPlatform: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

function isSupportedPlatform(platform: unknown): platform is SupportedPlatforms {
  return Object.keys(SupportedPlatforms).includes(platform as string)
}

function getOS(): Platforms | null {
  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K']
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']
  const iosPlatforms = ['iPhone', 'iPad', 'iPod']

  if (macosPlatforms.includes(platform)) return Platforms.macOS

  if (iosPlatforms.includes(platform)) return Platforms.iOS

  if (windowsPlatforms.includes(platform)) return Platforms.Windows

  if (/Android/.test(userAgent)) return Platforms.Android

  if (/Linux/.test(platform)) return Platforms.Linux

  return null
}

export function Provider({ children }: Props): ReactElement {
  const [platform, setPlatform] = useState<SupportedPlatforms>(SupportedPlatforms.Linux)

  // This is in useEffect as it really just needs to run once and not on each re-render
  useEffect(() => {
    const os = getOS()

    setPlatform(isSupportedPlatform(os) ? os : SupportedPlatforms.Linux)
  }, [])

  return <Context.Provider value={{ platform, setPlatform }}>{children}</Context.Provider>
}
