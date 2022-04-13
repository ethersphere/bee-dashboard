import axios from 'axios'
import { useEffect, useState } from 'react'
import { config } from '../config'

export interface LatestBeeReleaseHook {
  latestBeeRelease: LatestBeeRelease | null
  isLoadingLatestBeeRelease: boolean
  error: Error | null
}

export interface IsBeeDesktopHook {
  isBeeDesktop: boolean
  isLoading: boolean
}

interface Config {
  BEE_DESKTOP_URL: string
}

/**
 * Detect if the dashboard is run within bee-desktop
 *
 * @returns isBeeDesktop true if this is run within bee-desktop
 */
export const useIsBeeDesktop = (conf: Config = config): IsBeeDesktopHook => {
  const [isBeeDesktop, setIsBeeDesktop] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    axios
      .get(`${conf.BEE_DESKTOP_URL}/info`)
      .then(res => {
        if (res.data?.name === 'bee-desktop') setIsBeeDesktop(true)
        else setIsBeeDesktop(false)
      })
      .catch(() => {
        setIsBeeDesktop(false)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [conf])

  return { isBeeDesktop, isLoading }
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
