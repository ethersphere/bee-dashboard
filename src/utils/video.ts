export function isSupportedVideoType(type: string) {
  const commonVideoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/avi']

  if (commonVideoTypes.includes(type.toLowerCase())) {
    return true
  }

  const video = document.createElement('video')
  const result = video.canPlayType(type)

  return Boolean(result)
}
