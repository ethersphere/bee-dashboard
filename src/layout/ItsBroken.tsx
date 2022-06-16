import { Container } from '@material-ui/core'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { ReactElement } from 'react'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      backgroundColor: theme.palette.background.default,
      minHeight: '100vh',
      textAlign: 'center',
    },
    errorMsg: {
      marginTop: '30px',
    },
  }),
)

interface Props {
  message: string
}

// TODO: Provide some nicer design
const ItsBroken = ({ message }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div>
      <Container className={classes.content}>
        <h1>Ups, there was a problem 😅</h1>
        <h3 className={classes.errorMsg}>Error: {message}</h3>
      </Container>
    </div>
  )
}

export default ItsBroken
