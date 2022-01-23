/**
 * Utility function that is needed to have correct directory structure as webkitRelativePath is read only
 */
export function packageFile(file: SwarmFile): FilePath {
  const path = (file.path || file.webkitRelativePath || file.name).replace(/^\//g, '') // remove the starting slash

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
