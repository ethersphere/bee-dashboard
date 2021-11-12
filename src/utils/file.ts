const indexHtmls = ['index.html', 'index.htm']

export type NameWithPath = { name: string; path: string }

export function detectIndexHtml(files: NameWithPath[]): string | false {
  if (!files.length) {
    return false
  }

  const exactMatch = files.find(x => indexHtmls.includes(x.path))

  if (exactMatch) {
    return exactMatch.name
  }

  const prefix = files[0].path.split('/')[0] + '/'

  const allStartWithSamePrefix = files.every(x => x.path.startsWith(prefix))

  if (allStartWithSamePrefix) {
    const match = files.find(x => indexHtmls.map(y => prefix + y).includes(x.path))

    if (match) {
      return match.name
    }
  }

  return false
}
