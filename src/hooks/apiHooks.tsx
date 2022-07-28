import axios from 'axios'
import { useEffect, useState } from 'react'
import { config } from '../config'
import { getJson } from '../utils/net'
import { getLatestBeeDesktopVersion } from '../utils/desktop'

export interface LatestBeeReleaseHook {
  latestBeeRelease: LatestBeeRelease | null
  isLoadingLatestBeeRelease: boolean
  error: Error | null
}

export interface IsBeeDesktopHook {
  error: Error | null
  isLoading: boolean
  beeDesktopVersion: string
  desktopAutoUpdateEnabled: boolean
}

export interface NewDesktopVersionHook {
  newBeeDesktopVersion: string
}

interface Config {
  BEE_DESKTOP_URL: string
  BEE_DESKTOP_ENABLED: boolean
}

/**
 * Detect if the dashboard is run within bee-desktop
 *
 * @returns isBeeDesktop true if this is run within bee-desktop
 */
export const useIsBeeDesktop = (conf: Config = config): IsBeeDesktopHook => {
  const [desktopAutoUpdateEnabled, setDesktopAutoUpdateEnabled] = useState<boolean>(true)
  const [beeDesktopVersion, setBeeDesktopVersion] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)
  const isBeeDesktop = conf.BEE_DESKTOP_ENABLED

  useEffect(() => {
    if (!isBeeDesktop) {
      setLoading(false)
      setError(null)
    } else {
      axios
        .get(`${conf.BEE_DESKTOP_URL}/info`)
        .then(res => {
          setBeeDesktopVersion(res.data?.version)
          setDesktopAutoUpdateEnabled(res.data?.autoUpdateEnabled)
          setError(null)
        })
        .catch(e => {
          setError(e)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [conf, isBeeDesktop])

  return { error, isLoading, beeDesktopVersion, desktopAutoUpdateEnabled }
}

async function checkNewVersion(conf: Config): Promise<string> {
  const resJson = await (await fetch(`${conf.BEE_DESKTOP_URL}/info`)).json()
  const currentVersion = resJson.version
  const latestVersion = await getLatestBeeDesktopVersion()

  if (currentVersion !== latestVersion) {
    return latestVersion
  }

  return ''
}

export function useNewBeeDesktopVersion(isBeeDesktop: boolean, conf: Config = config): NewDesktopVersionHook {
  const [newBeeDesktopVersion, setNewBeeDesktopVersion] = useState<string>('')

  useEffect(() => {
    if (!isBeeDesktop) {
      return
    }

    checkNewVersion(conf).then(version => {
      if (version !== '') {
        setNewBeeDesktopVersion(version)
      }
    })
  }, [isBeeDesktop, conf])

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
  config: BeeConfig | null
  isLoading: boolean
  error: Error | null
}

export const useGetBeeConfig = (conf: Config = config): GetBeeConfig => {
  const [beeConfig, setBeeConfig] = useState<BeeConfig | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getJson<BeeConfig>(`${conf.BEE_DESKTOP_URL}/config`)
      .then(beeConf => {
        setBeeConfig(beeConf)
        setError(null)
      })
      .catch((err: Error) => {
        setError(err)
        setBeeConfig(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [conf])

  return { config: beeConfig, isLoading, error }
}

export const useLatestBeeRelease = (): LatestBeeReleaseHook => {
  const [latestBeeRelease, setLatestBeeRelease] = useState<LatestBeeRelease | null>(null)
  const [isLoadingLatestBeeRelease, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    axios
      .get(`${config.GITHUB_REPO_URL}/releases/latest`)
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
