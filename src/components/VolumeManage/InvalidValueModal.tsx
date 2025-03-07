import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    modalContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      padding: '25px',
      width: '481px',
      height: '260px',
      backgroundColor: '#EDEDED',
      display: 'flex',

      flexDirection: 'column',
      justifyContent: 'space-between',
      zIndex: 999,
    },
    modalHeader: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '24px',
      fontWeight: 400,
      letterSpacing: '0%',
    },
    modalContentText: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '0%',
    },
    modalQuestion: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: '18px',
      letterSpacing: '0%',
    },
    buttonElementCancel: {
      backgroundColor: '#FFFFFF',
      width: '256px',
      height: '42px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '&:hover': {
        backgroundColor: '#DE7700',
        color: '#FFFFFF',
      },
    },
  }),
)

interface InvalidValueModalProps {
  modalDisplay: (value: boolean) => void
}

const InvalidValueModal = ({ modalDisplay }: InvalidValueModalProps): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.modalContainer}>
      <div className={classes.modalContent}>
        <div className={classes.modalHeader}>Warning</div>
        <div className={classes.modalContentText}>You cannot set smaller value then the original!</div>
        <div className={classes.buttonElementCancel} style={{ width: '160px' }} onClick={() => modalDisplay(false)}>
          Cancel
        </div>
      </div>
    </div>
  )
}

export default InvalidValueModal
