import axios from 'axios'
import { useEffect, useState } from 'react'
import { config } from '../config'

export interface LatestBeeReleaseHook {
  latestBeeRelease: LatestBeeRelease | null
  isLoadingLatestBeeRelease: boolean
  error: Error | null
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
