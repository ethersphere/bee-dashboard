import { ReactElement } from 'react'
import * as Sentry from '@sentry/react'
import { Link } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

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
  const classes = useStyles()

  return (
    <Link onClick={showFeedbackForm}>
      <div className={classes.root}>Give us feedback!</div>
    </Link>
  )
}
