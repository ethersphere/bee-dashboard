export function isSupportedVideoType(type: string) {
  const video = document.createElement('video')

  return video.canPlayType(type) !== ''
}
