// FIXME: in the Swarm Extension process is not defined and would throw an error
// see https://github.com/ethersphere/bee-dashboard/issues/518
export function getEnvVariable(variableName: string): string | undefined {
  if (typeof process === 'object') return process.env[variableName]
}

class Config {
  public readonly BEE_API_HOST: string
  public readonly BEE_DEBUG_API_HOST: string
  public readonly BLOCKCHAIN_EXPLORER_URL: string
  public readonly BEE_DOCS_HOST: string
  public readonly BEE_DISCORD_HOST: string
  public readonly GITHUB_REPO_URL: string
  public readonly BEE_DESKTOP_ENABLED: boolean
  public readonly BEE_DESKTOP_URL: string
  public readonly SENTRY_KEY: string | undefined
  public readonly SENTRY_ENVIRONMENT: string | undefined
  public readonly DEFAULT_RPC_URL: string

  constructor() {
    this.BEE_API_HOST =
      sessionStorage.getItem('api_host') ?? getEnvVariable('REACT_APP_BEE_HOST') ?? 'http://localhost:1633'
    this.SENTRY_KEY = getEnvVariable('REACT_APP_SENTRY_KEY')
    this.SENTRY_ENVIRONMENT = getEnvVariable('REACT_APP_SENTRY_ENVIRONMENT')
    this.BEE_DEBUG_API_HOST =
      sessionStorage.getItem('debug_api_host') ?? getEnvVariable('REACT_APP_BEE_DEBUG_HOST') ?? 'http://localhost:1635'
    this.BLOCKCHAIN_EXPLORER_URL =
      getEnvVariable('REACT_APP_BLOCKCHAIN_EXPLORER_URL') ?? 'https://blockscout.com/xdai/mainnet'
    this.BEE_DOCS_HOST = getEnvVariable('REACT_APP_BEE_DOCS_HOST') ?? 'https://docs.ethswarm.org/docs/'
    this.BEE_DISCORD_HOST = getEnvVariable('REACT_APP_BEE_DISCORD_HOST') ?? 'https://discord.gg/eKr9XPv7'
    this.GITHUB_REPO_URL =
      getEnvVariable('REACT_APP_BEE_GITHUB_REPO_URL') ?? 'https://api.github.com/repos/ethersphere/bee'
    this.BEE_DESKTOP_ENABLED = getEnvVariable('REACT_APP_BEE_DESKTOP_ENABLED') === 'true'
    this.BEE_DESKTOP_URL = getEnvVariable('REACT_APP_BEE_DESKTOP_URL') ?? window.location.origin
    this.DEFAULT_RPC_URL = getEnvVariable('REACT_APP_DEFAULT_RPC_URL') ?? 'https://xdai.fairdatasociety.org'
  }
}

export const config = new Config()

export default config
