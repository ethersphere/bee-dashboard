import { createStyles, makeStyles } from '@material-ui/core'
import { ReactElement } from 'react'

interface Props {
  children: ReactElement | ReactElement[]
}

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '175px',
      height: '175px',
      background: `repeating-linear-gradient(
                        45deg,
                        #efefef,
                        #efefef 4px,
                        #ffffff 4px,
                        #ffffff 8px
                    )`,
    },
  }),
)

export function StripedWrapper({ children }: Props): ReactElement {
  const classes = useStyles()

  return <div className={classes.wrapper}>{children}</div>
}
