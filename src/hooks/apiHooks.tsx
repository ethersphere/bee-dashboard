import axios from 'axios'
import { useEffect, useState } from 'react'

import { GITHUB_REPO_URL } from '../constants'
import { BeeConfig, getDesktopConfiguration, getLatestBeeDesktopVersion } from '../utils/desktop'

export interface LatestBeeReleaseHook {
  latestBeeRelease: LatestBeeRelease | null
  isLoadingLatestBeeRelease: boolean
  error: Error | null
}

export interface BeeDesktopHook {
  reachable: boolean
  error: Error | null
  isLoading: boolean
  beeDesktopVersion: string
  desktopAutoUpdateEnabled: boolean
}

export interface NewDesktopVersionHook {
  newBeeDesktopVersion: string
}

const REACHABILITY_CHECK_INTERVAL_MS = 10_000

export const useBeeDesktop = (isBeeDesktop = false, desktopUrl: string): BeeDesktopHook => {
  const [reachable, setReachable] = useState(false)
  const [desktopAutoUpdateEnabled, setDesktopAutoUpdateEnabled] = useState<boolean>(true)
  const [beeDesktopVersion, setBeeDesktopVersion] = useState<string>('')
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!isBeeDesktop) {
      setLoading(false)
      setError(null)

      return
    }

    function runReachabilityCheck() {
      axios
        .get(`${desktopUrl}/info`)
        .then(() => {
          setReachable(true)
        })
        .catch(() => {
          setReachable(false)
        })
    }

    runReachabilityCheck()
    const interval = setInterval(runReachabilityCheck, REACHABILITY_CHECK_INTERVAL_MS)

    axios
      .get(`${desktopUrl}/info`)
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

    return () => clearInterval(interval)
  }, [desktopUrl, isBeeDesktop])

  return { error, isLoading, beeDesktopVersion, desktopAutoUpdateEnabled, reachable }
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

export function useNewBeeDesktopVersion(
  isBeeDesktop: boolean,
  desktopUrl: string,
  desktopAutoUpdateEnabled: boolean,
): NewDesktopVersionHook {
  const [newBeeDesktopVersion, setNewBeeDesktopVersion] = useState<string>('')

  useEffect(() => {
    if (!isBeeDesktop || desktopAutoUpdateEnabled) {
      return
    }

    checkNewVersion(desktopUrl).then(version => {
      if (version !== '') {
        setNewBeeDesktopVersion(version)
      }
    })
  }, [isBeeDesktop, desktopUrl, desktopAutoUpdateEnabled])

  return { newBeeDesktopVersion }
}

export interface GetBeeConfig {
  config: BeeConfig | null
  isLoading: boolean
  error: Error | null
}

export const useGetBeeConfig = (desktopUrl: string): GetBeeConfig => {
  const [beeConfig, setBeeConfig] = useState<BeeConfig | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    getDesktopConfiguration(desktopUrl)
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
  }, [desktopUrl])

  return { config: beeConfig, isLoading, error }
}

export const useLatestBeeRelease = (): LatestBeeReleaseHook => {
  const [latestBeeRelease, setLatestBeeRelease] = useState<LatestBeeRelease | null>(null)
  const [isLoadingLatestBeeRelease, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

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
