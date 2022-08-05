import { getEnvVariable } from './config'

export const META_FILE_NAME = '.swarmgatewaymeta.json'
export const PREVIEW_FILE_NAME = '.swarmgatewaypreview.jpeg'
export const PREVIEW_DIMENSIONS = { maxWidth: 250, maxHeight: 175 }
export const BZZ_LINK_DOMAIN = getEnvVariable('REACT_APP_BZZ_LINK_DOMAIN') || 'bzz.link'
