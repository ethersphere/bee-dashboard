export function isSupportedVideoType(type: string) {
  const video = document.createElement('video')

  const result = video.canPlayType(type)
  const isDefinitelySupported = result && result !== 'maybe'

  return Boolean(isDefinitelySupported)
}
