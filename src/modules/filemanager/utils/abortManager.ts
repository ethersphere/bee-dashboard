export class AbortManager {
  private controllers = new Map<string, AbortController>()

  create(key: string): AbortController | undefined {
    if (!this.controllers.has(key)) {
      this.controllers.set(key, new AbortController())
    }

    return this.controllers.get(key)
  }

  getSignal(key: string): AbortSignal | undefined {
    return this.controllers.get(key)?.signal
  }

  abort(key: string): void {
    const controller = this.controllers.get(key)
    controller?.abort()
    this.controllers.delete(key)
  }

  has(key: string): boolean {
    return this.controllers.has(key)
  }

  clear(): void {
    this.controllers.forEach(controller => controller.abort())
    this.controllers.clear()
  }
}
