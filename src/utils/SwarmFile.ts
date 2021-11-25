export class SwarmFile {
  public name: string
  public path: string
  public type: string
  public size: number
  public webkitRelativePath: string
  public arrayBuffer: () => Promise<ArrayBuffer>
  private data: Promise<ArrayBuffer>

  constructor(file: File) {
    const path = Reflect.get(file, 'path') || file.webkitRelativePath || file.name
    this.path = path.startsWith('/') ? path.slice(1) : path
    this.webkitRelativePath = this.path
    this.name = file.name
    this.type = file.type
    this.size = file.size
    this.data = file.arrayBuffer()
    this.arrayBuffer = async () => {
      const data = await this.data

      return data
    }
  }
}
