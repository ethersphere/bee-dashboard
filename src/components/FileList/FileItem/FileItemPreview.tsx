import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import PreviewIcon from '../../icons/PreviewIcon'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      backgroundColor: '#343434',
      color: '#ffffff',
      fontSize: '20px',
      width: '48px',
      height: '24px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      clipPath: 'polygon(0% 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%)',
      top: '0',
      left: '0',
    },
  }),
)

const Preview = (): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <PreviewIcon />
    </div>
  )
}

export default Preview
