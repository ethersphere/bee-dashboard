export async function tryCatch<T>(fn: () => Promise<T>): Promise<[T, null] | [null, unknown]> {
  try {
    return [await fn(), null]
  } catch (err) {
    return [null, err]
  }
}
