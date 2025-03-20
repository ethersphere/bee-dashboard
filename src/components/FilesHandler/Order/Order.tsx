import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext } from 'react'
import OrderIcon from '../../icons/OrderIcon'
import { Context as FileManagerContext } from '../../../providers/FileManager'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      display: 'flex',
      width: '65px',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#333333',
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
      zIndex: 1,
      width: '150px',
      flexDirection: 'column',
      justifyContent: 'left',
      alignItems: 'center',
      boxSizing: 'border-box',
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
  }),
)

const Order = (): ReactElement => {
  const classes = useStyles()
  const { setFileOrder } = useContext(FileManagerContext)

  return (
    <div className={classes.container}>
      <OrderIcon />
      <div>Order</div>
      <div className={classes.dropdown}>
        <div onClick={() => setFileOrder('nameAsc')}>Alphabet inc.</div>
        <div onClick={() => setFileOrder('nameDesc')}>Alphabet dec.</div>
        <div onClick={() => setFileOrder('sizeAsc')}>Size inc.</div>
        <div onClick={() => setFileOrder('sizeDesc')}>Size dec.</div>
        {/* <div>Date/time inc.</div>
        <div>Date/time dec.</div> */}
      </div>
    </div>
  )
}

export default Order
