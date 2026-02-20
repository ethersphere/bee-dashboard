import { Grid, Typography } from '@mui/material'
import { ReactElement } from 'react'
import { makeStyles } from 'tss-react/mui'

interface Props {
  steps: string[]
  index: number
}

const useStyles = makeStyles()(() => ({
  wrapper: {
    height: '52px',
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todo: {
    background: '#f7f7f7',
    color: '#c9c9c9',
  },
  inProgress: {
    background: '#ffffff',
    color: '#242424',
    height: '52px',
  },
  done: {
    background: '#f7f7f7',
    color: '#606060',
    height: '52px',
  },
}))

export function ProgressIndicator({ steps, index }: Props): ReactElement {
  const { classes } = useStyles()

  function pickClass(i: number): string {
    if (i === index) {
      return classes.inProgress
    }

    return i < index ? classes.done : classes.todo
  }

  return (
    <Grid container justifyContent="space-between">
      {steps.map((x, i) => (
        <div key={i} className={`${classes.wrapper} ${pickClass(i)}`}>
          <Typography>{x}</Typography>
        </div>
      ))}
    </Grid>
  )
}
