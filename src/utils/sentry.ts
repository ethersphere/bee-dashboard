import { config } from '../config'
import * as Sentry from '@sentry/react'
import packageJson from '../../package.json'
import { BrowserTracing } from '@sentry/tracing'
import { getBeeDesktopLogs, getBeeLogs } from './desktop'

export async function initSentry(): Promise<void> {
  let tunnelAvailable

  try {
    const result = await fetch(`${config.BEE_DESKTOP_URL}/sentry`, { method: 'OPTIONS' })

    if (result.status === 204) {
      tunnelAvailable = true
    }
  } catch (e) {
    // There was an error, so tunnel is not available
    tunnelAvailable = false
  }

  Sentry.init({
    dsn: config.SENTRY_KEY,
    release: packageJson.version,
    tunnel: tunnelAvailable ? `${config.BEE_DESKTOP_URL}/sentry` : undefined,
    integrations: [new BrowserTracing({ tracingOrigins: ['localhost'] })],
    tracesSampleRate: 0.3,
    beforeSend: async (event, hint) => {
      hint.attachments = []

      try {
        // This will fail if we are not running in Bee Desktop, but that is alright
        hint.attachments.push({ filename: 'bee-desktop.log', data: await getBeeDesktopLogs() })
        // eslint-disable-next-line no-empty
      } catch (e) {}

      try {
        // This will fail if we are not running in Bee Desktop, but that is alright
        hint.attachments.push({ filename: 'bee.log', data: await getBeeLogs() })
        // eslint-disable-next-line no-empty
      } catch (e) {}

      return event
    },
  })
}
