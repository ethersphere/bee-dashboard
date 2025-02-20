import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
      //   backdropFilter: 'blur(5px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: '#EDEDED',
      padding: '20px',
      width: '552px',
      height: '696px',
    },
    modalHeader: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '20px',
      fontWeight: 700,
      lineHeight: '26px',
    },
    modalContent: {
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '28px',
    },
    flexCenter: {
      display: 'flex',
      gap: '20px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    volumenButtonContainer: {
      position: 'relative',
    },
    buttonElement: {
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
    buttonElementNotificationSign: {
      position: 'absolute',
      right: '-25px',
      top: '0',
    },
    buttonNewVolume: {
      backgroundColor: '#DE7700',
      color: '#FFFFFF',
    },
    cancelButtonContainer: {
      display: 'flex',
      justifyContent: 'right',
    },
    tabPanel: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      backgroundColor: '#F7F7F7',
      height: '42px',
      fontFamily: '"iAWriterMonoV", monospace',
    },
    tabPanelItem: {
      display: 'flex',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabPanelItemActive: {
      backgroundColor: '#FFFFFF',
      color: '#FFFFFF',
    },
  }),
)

interface NewVolumeModalProps {
  modalDisplay: (value: boolean) => void
}

const NewVolumeModal = (props: NewVolumeModalProps): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.modal}>
      <div className={classes.modalContainer}>
        <div className={classes.tabPanel}>
          <div className={classes.tabPanelItem}>Properties</div>
          <div className={classes.tabPanelItem}>Sharing</div>
        </div>
        <div className={classes.cancelButtonContainer}>
          <div className={classes.buttonElement} style={{ width: '160px' }} onClick={() => props.modalDisplay(false)}>
            Cancel
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewVolumeModal
