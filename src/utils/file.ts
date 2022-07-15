const indexHtmls = ['index.html', 'index.htm']

interface DetectedIndex {
  indexPath: string
  commonPrefix?: string
}

export function detectIndexHtml(files: FilePath[]): DetectedIndex | false {
  const paths = files.map(getPath)

  if (!paths.length) {
    return false
  }

  const exactMatch = paths.find(x => indexHtmls.includes(x))

  if (exactMatch) {
    return { indexPath: exactMatch }
  }

  const prefix = paths[0].split('/')[0] + '/'

  const allStartWithSamePrefix = paths.every(x => x.startsWith(prefix))

  if (allStartWithSamePrefix) {
    const match = paths.find(x => indexHtmls.map(y => prefix + y).includes(x))

    if (match) {
      return { indexPath: match, commonPrefix: prefix }
    }
  }

  return false
}

export function getHumanReadableFileSize(bytes: number): string {
  if (bytes >= 1e15) {
    return (bytes / 1e15).toFixed(2) + ' PB'
  }

  if (bytes >= 1e12) {
    return (bytes / 1e12).toFixed(2) + ' TB'
  }

  if (bytes >= 1e9) {
    return (bytes / 1e9).toFixed(2) + ' GB'
  }

  if (bytes >= 1e6) {
    return (bytes / 1e6).toFixed(2) + ' MB'
  }

  if (bytes >= 1e3) {
    return (bytes / 1e3).toFixed(2) + ' kB'
  }

  return bytes + ' bytes'
}

export function getAssetNameFromFiles(files: FilePath[]): string {
  if (files.length === 1) return files[0].name

  if (files.length > 0) {
    const prefix = getPath(files[0]).split('/')[0]

    // Only if all files have a common prefix we can use it as a folder name
    if (files.every(f => getPath(f).split('/')[0] === prefix)) return prefix
  }

  return 'unknown'
}

export function getMetadata(files: FilePath[]): Metadata {
  const size = files.reduce((total, item) => total + item.size, 0)
  const isWebsite = Boolean(detectIndexHtml(files))
  const name = getAssetNameFromFiles(files)
  const type = files.length === 1 ? files[0].type : 'folder'
  const count = files.length

  return { size, name, type, isWebsite, count }
}

export function getPath(file: FilePath): string {
  return (file.path || file.webkitRelativePath || file.name).replace(/^\//g, '') // remove the starting slash
}

/**
 * Utility function that is needed to have correct directory structure as webkitRelativePath is read only
 */
export function packageFile(file: FilePath, pathOverwrite?: string): FilePath {
  let path = pathOverwrite || getPath(file)

  if (!path.startsWith('/') && path.lastIndexOf('/') !== 0) {
    path = `/${path}`
  }

  return {
    path: path,
    fullPath: path,
    webkitRelativePath: path,
    lastModified: file.lastModified,
    name: file.name,
    size: file.size,
    type: file.type,
    stream: file.stream,
    slice: file.slice,
    text: file.text,
    arrayBuffer: async () => await file.arrayBuffer(), // This is needed for successful upload and can not simply be { arrayBuffer: file.arrayBuffer }
  }
}
