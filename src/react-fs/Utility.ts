export function joinUrl(...parts: unknown[]): string {
  return parts
    .filter(x => x)
    .join('/')
    .replace(/(?<!:)\/+/g, '/')
}
