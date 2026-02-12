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
  Linux = Platforms.Linux,
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

export enum BrowserPlatform {
  Chrome = 'chrome',
  Firefox = 'firefox',
  Safari = 'safari',
  Brave = 'brave',
  Edge = 'edge',
}

export async function isBraveBrowser(): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (window.navigator.brave && (await window.navigator.brave.isBrave())) === true
}

export async function detectBrowser(): Promise<BrowserPlatform> {
  const ua = window.navigator.userAgent.toLowerCase()

  if (ua.includes('edge')) return BrowserPlatform.Edge

  if (ua.includes('chrome')) {
    if (await isBraveBrowser()) return BrowserPlatform.Brave

    return BrowserPlatform.Chrome
  }

  if (ua.includes('firefox')) return BrowserPlatform.Firefox

  if (ua.includes('safari')) return BrowserPlatform.Safari

  return BrowserPlatform.Chrome
}

export const cacheClearUrls = {
  chrome: 'https://support.google.com/accounts/answer/32050?hl=en&co=GENIE.Platform%3DDesktop',
  brave: 'https://support.brave.app/hc/en-us/articles/360048833872-How-Do-I-Clear-Cookies-And-Site-Data-In-Brave',
  firefox: 'https://support.mozilla.org/en-US/kb/how-clear-firefox-cache',
  safari: 'https://support.apple.com/en-il/guide/safari/sfri47acf5d6/mac',
  edge: 'https://support.microsoft.com/en-us/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4',
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
