import axios from 'axios'
import { useEffect, useState } from 'react'
import { getJson } from '../utils/net'
import { getLatestBeeDesktopVersion } from '../utils/desktop'
import { GITHUB_REPO_URL } from '../constants'

export interface LatestBeeReleaseHook {
  latestBeeRelease?: LatestBeeRelease
  isLoadingLatestBeeRelease: boolean
  error?: Error
}

export interface BeeDesktopHook {
  error?: Error
  isLoading: boolean
  beeDesktopVersion: string
  desktopAutoUpdateEnabled: boolean
}

export interface NewDesktopVersionHook {
  newBeeDesktopVersion: string
}

/**
 * Gets information about Desktop backend.
 */
export const useBeeDesktop = (isBeeDesktop = false, desktopUrl: string): BeeDesktopHook => {
  const [desktopAutoUpdateEnabled, setDesktopAutoUpdateEnabled] = useState<boolean>(true)
  const [beeDesktopVersion, setBeeDesktopVersion] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    if (!isBeeDesktop) {
      setLoading(false)
      setError(undefined)
    } else {
      axios
        .get(`${desktopUrl}/info`)
        .then(res => {
          setBeeDesktopVersion(res.data?.version)
          setDesktopAutoUpdateEnabled(res.data?.autoUpdateEnabled)
          setError(undefined)
        })
        .catch(e => {
          setError(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [desktopUrl, isBeeDesktop])

  return { error, isLoading, beeDesktopVersion, desktopAutoUpdateEnabled }
}

async function checkNewVersion(desktopUrl: string): Promise<string> {
  const resJson = await (await fetch(`${desktopUrl}/info`)).json()
  const currentVersion = resJson.version
  const latestVersion = await getLatestBeeDesktopVersion()

  if (currentVersion !== latestVersion) {
    return latestVersion
  }

  return ''
}

export function useNewBeeDesktopVersion(isBeeDesktop: boolean, desktopUrl: string): NewDesktopVersionHook {
  const [newBeeDesktopVersion, setNewBeeDesktopVersion] = useState<string>('')

  useEffect(() => {
    if (!isBeeDesktop) {
      return
    }

    checkNewVersion(desktopUrl).then(version => {
      if (version !== '') {
        setNewBeeDesktopVersion(version)
      }
    })
  }, [isBeeDesktop, desktopUrl])

  return { newBeeDesktopVersion }
}

export interface BeeConfig {
  'api-addr': string
  'debug-api-addr': string
  'debug-api-enable': boolean
  password: string
  'swap-enable': boolean
  'swap-initial-deposit': bigint
  mainnet: boolean
  'full-node': boolean
  'chain-enable': boolean
  'cors-allowed-origins': string
  'resolver-options': string
  'use-postage-snapshot': boolean
  'data-dir': string
  transaction: string
  'block-hash': string
  'swap-endpoint'?: string
}

export interface GetBeeConfig {
  config?: BeeConfig
  isLoading: boolean
  error?: Error
}

export const useGetBeeConfig = (desktopUrl: string): GetBeeConfig => {
  const [beeConfig, setBeeConfig] = useState<BeeConfig | undefined>()
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    getJson<BeeConfig>(`${desktopUrl}/config`)
      .then(beeConf => {
        setBeeConfig(beeConf)
        setError(undefined)
      })
      .catch((err: Error) => {
        setError(err)
        setBeeConfig(undefined)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [desktopUrl])

  return { config: beeConfig, isLoading, error }
}

export const useLatestBeeRelease = (): LatestBeeReleaseHook => {
  const [latestBeeRelease, setLatestBeeRelease] = useState<LatestBeeRelease | undefined>()
  const [isLoadingLatestBeeRelease, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | undefined>()

  useEffect(() => {
    axios
      .get(`${GITHUB_REPO_URL}/releases/latest`)
      .then(res => {
        setLatestBeeRelease(res.data)
      })
      .catch((error: Error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return { latestBeeRelease, isLoadingLatestBeeRelease, error }
}
