export function getPrettyDateString(date: Date): string {
  const string = date.toString()

  return string.split('GMT')[0].trim()
}
