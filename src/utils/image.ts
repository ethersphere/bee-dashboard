interface Dimensions {
  width: number
  height: number
}

/**
 * Get the dimensions of the image after resize
 *
 * @param imgWidth  Current image width
 * @param imgHeight Current image height
 * @param maxWidth  Desired max width
 * @param maxHeight Desired max height
 *
 * @returns Downscaled dimensions of the image to fit in the bounding box
 */
export function getDimensions(imgWidth: number, imgHeight: number, maxWidth?: number, maxHeight?: number): Dimensions {
  const ratioWidth = maxWidth ? imgWidth / maxWidth : 1
  const ratioHeight = maxHeight ? imgHeight / maxHeight : 1

  const ratio = Math.max(ratioWidth, ratioHeight)

  // No need to resize
  if (ratio <= 1) return { width: imgWidth, height: imgHeight }

  return { width: imgWidth / ratio, height: imgHeight / ratio }
}

/**
 * Resize image passed to fit in the bounding box defined with maxWidth and maxHeight.
 * Note that one or both of the bounding box dimensions may be omitted
 *
 * @param file      Image file to be resized
 * @param maxWidth  Maximal image width
 * @param maxHeight Maximal image height
 *
 * @returns Promise that resolves into the resized image blob
 */
export function resize(file: File, maxWidth?: number, maxHeight?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const allowedTypes = [
      'image/bmp',
      'image/gif',
      'image/vnd.microsoft.icon',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/tiff',
      'image/webp',
    ]

    if (!file.size || !file.type || !allowedTypes.includes(file.type)) return reject('File not supported!')

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = event => {
        const src = event?.target?.result

        if (!src || typeof src !== 'string') throw new Error('Failed to load the image source')

        const img = new Image()
        img.src = src
        img.onload = () => {
          const dimensions = getDimensions(img.width, img.height, maxWidth, maxHeight)
          const elem = document.createElement('canvas')
          elem.width = dimensions.width
          elem.height = dimensions.height
          const ctx = elem.getContext('2d')

          if (!ctx) throw new Error('Failed to create canvas context')

          ctx.drawImage(img, 0, 0, elem.width, elem.height)
          ctx.canvas.toBlob(
            blob => {
              if (!blob) throw new Error('Failed to extract the blob from canvas')

              resolve(blob)
            },
            'image/jpeg',
            1,
          )
        }
      }
      reader.onerror = error => reject(error)
    } catch (error) {
      reject(error)
    }
  })
}
