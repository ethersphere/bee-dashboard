export function isSupportedAudioType(type: string) {
  const commonAudioTypes = [
    'audio/wav',
    'audio/wave',
    'audio/x-wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/ogg',
    'audio/webm',
    'audio/aac',
    'audio/flac',
    'audio/m4a',
    'audio/x-m4a',
  ]

  if (commonAudioTypes.includes(type.toLowerCase())) {
    return true
  }

  const audio = document.createElement('audio')
  const result = audio.canPlayType(type)

  return Boolean(result)
}
