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

/**
 * Detect if the dashboard is run within bee-desktop
 *
 * @returns isBeeDesktop true if this is run within bee-desktop
 */
export const useIsBeeDesktop = (): IsBeeDesktopHook => {
  const [isBeeDesktop, setIsBeeDesktop] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    axios
      .get(`${config.BEE_DESKTOP_URL}/info`)
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
  }, [])

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
