class Config {
  public readonly BEE_API_HOST: string
  public readonly BEE_DEBUG_API_HOST: string

  constructor() {
    this.BEE_API_HOST = sessionStorage.getItem('api_host') ?? process.env.REACT_APP_BEE_HOST ?? 'http://localhost:1633'
    this.BEE_DEBUG_API_HOST =
      sessionStorage.getItem('debug_api_host') ?? process.env.REACT_APP_BEE_DEBUG_HOST ?? 'http://localhost:1635'
  }
}

export const config = new Config()

export default config
