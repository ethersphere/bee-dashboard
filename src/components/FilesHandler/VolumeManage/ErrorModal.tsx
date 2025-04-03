import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

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
  }),
)

interface InvalidValueModalProps {
  modalDisplay: (value: boolean) => void
}

const ErrorModal = ({ modalDisplay }: InvalidValueModalProps): ReactElement => {
  const classes = useStyles()
  const classesGlobal = useFileManagerGlobalStyles()

  return (
    <div className={classes.modalContainer}>
      <div className={classes.modalContent}>
        <div className={classesGlobal.modalHeader}>Warning!</div>
        <div className={classes.modalContentText}>Uh oh, an error happened</div>
        <div className={classesGlobal.bottomButtonContainer}>
          <div
            className={`${classesGlobal.buttonElementBase} ${classesGlobal.generalButtonElement}`}
            style={{ width: '160px' }}
            onClick={() => modalDisplay(false)}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
