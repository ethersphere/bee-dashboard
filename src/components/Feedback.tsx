import { ReactElement, useState } from 'react'
import * as Sentry from '@sentry/react'
import { Link } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import config from '../config'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      fontSize: theme.typography.fontSize - 2,
      color: 'rgb(159, 159, 159)',
      cursor: 'pointer',

      '&:hover': {
        textDecorationColor: 'rgb(159, 159, 159)',
      },
    },
  }),
)

/**
 * Parses Sentry DNS so it could be transformed into API call
 * Sentry DNS like https://1asfasdf2312asdf3@o132123.ingest.sentry.io/13123123
 */
const SENTRY_PARSING_REGEX = /^https:\/\/(?<key>\w+)@(?<sub>\w+)\.ingest\.sentry\.io\/(?<path>\d+)$/gm
let SENTRY_ACCESS_VERIFIED = false

async function isSentryReachable(): Promise<boolean> {
  SENTRY_ACCESS_VERIFIED = true
  const key = config.SENTRY_KEY

  if (!key) {
    return false
  }

  const match = SENTRY_PARSING_REGEX.exec(key)

  if (!match) {
    return false
  }

  const url = `https://${match.groups?.sub}.ingest.sentry.io/api/${match.groups?.path}/envelope/?sentry_key=${match.groups?.key}`

  try {
    await fetch(url, { method: 'POST' })

    // Since we got some reply (even though most probably with some error) that means Sentry is reachable ==> lets provide the Feedback form
    return true
  } catch (e) {
    // If an error was thrown than the request was blocked by the browser so Sentry is not accessible to us
    return false
  }
}

function showFeedbackForm(): void {
  const eventId = Sentry.captureMessage('User feedback')
  Sentry.showReportDialog({
    eventId,
    title: 'Provide us feedback!',
    subtitle: 'Share with us what you like and/or dislike.',
    subtitle2: 'We will be very happy.',
    labelComments: 'What is your impression about this app?',
    labelSubmit: 'Send Feedback',
  })
}

export default function Feedback(): ReactElement {
  const [sentryEnabled, setSentryEnabled] = useState(false)
  const classes = useStyles()

  if (!SENTRY_ACCESS_VERIFIED) {
    isSentryReachable().then(result => {
      setSentryEnabled(result)
    })
  }

  if (sentryEnabled) {
    return (
      <Link onClick={showFeedbackForm}>
        <div className={classes.root}>Give us feedback!</div>
      </Link>
    )
  }

  return <></>
}
