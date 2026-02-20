import { createContext, ReactElement, ReactNode, useState } from 'react'

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
  setPlatform: () => {},
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactNode
}

function isSupportedPlatform(platform: unknown): platform is SupportedPlatforms {
  return Object.keys(SupportedPlatforms).includes(platform as string)
}

function getOS(): Platforms | null {
  const userAgent = window.navigator.userAgent

  if (/Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)) return Platforms.macOS

  if (/iPhone|iPad|iPod/.test(userAgent)) return Platforms.iOS

  if (/Win32|Win64|Windows|WinCE/.test(userAgent)) return Platforms.Windows

  if (/Android/.test(userAgent)) return Platforms.Android

  if (/Linux/.test(userAgent)) return Platforms.Linux

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

  if (ua.includes('edge') || ua.includes('edg/')) return BrowserPlatform.Edge

  if (ua.includes('chrome') && (await isBraveBrowser())) return BrowserPlatform.Brave

  if (ua.includes('firefox')) return BrowserPlatform.Firefox

  if (ua.includes('safari') && !ua.includes('chrome')) return BrowserPlatform.Safari

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
  const [platform, setPlatform] = useState<SupportedPlatforms>(() => {
    const os = getOS()

    return isSupportedPlatform(os) ? os : SupportedPlatforms.Linux
  })

  return <Context.Provider value={{ platform, setPlatform }}>{children}</Context.Provider>
}
