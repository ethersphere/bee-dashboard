import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import NotificationSign from '../NotificationSign'
import DownloadIcon from '../icons/DownloadIcon'
import { Context as FileManagerContext } from '../../providers/FileManager'
import { useContext } from 'react'
import { startDownloadingQueue } from '../../utils/file'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      color: '#DE7700',
      width: '65px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontFamily: '"iAWriterMonoV", monospace',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
      '&:hover $dropdown': {
        display: 'flex',
      },
    },
    dropdown: {
      display: 'none',
      backgroundColor: '#ffffff',
      position: 'absolute',
      top: '100%',
      right: '0px',
      zIndex: 1,
      width: '200px',
      flexDirection: 'column',
      justifyContent: 'left',
      alignItems: 'center',
      boxSizing: 'border-box',
      color: '#333333',
      '& div': {
        width: '100%',
        display: 'flex',
        justifyContent: 'left',
        alignItems: 'center',
        padding: '10px',
      },
      '& div:hover': {
        backgroundColor: '#DE7700',
        color: '#ffffff',
      },
    },
    absoluteRight: {
      position: 'absolute',
      right: '5px',
      top: '2px',
    },
  }),
)

interface Props {
  notificationText?: string
}

const Download = (props: Props): ReactElement => {
  const classes = useStyles()
  const { fileDownLoadQueue, filemanager } = useContext(FileManagerContext)

  return (
    <div className={classes.container}>
      <DownloadIcon />

      <div>Download</div>
      {props.notificationText ? (
        <div className={classes.absoluteRight}>
          <NotificationSign text={props.notificationText} />
        </div>
      ) : null}
      <div className={classes.dropdown}>
        <div
          onClick={() => {
            startDownloadingQueue(filemanager, fileDownLoadQueue)
          }}
        >
          Start downloading queue
        </div>
        <div>Clear queue</div>
      </div>
    </div>
  )
}

export default Download
