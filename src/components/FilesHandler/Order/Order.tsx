import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext } from 'react'
import OrderIcon from '../../icons/OrderIcon'
import { Context as FileManagerContext } from '../../../providers/FileManager'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

const useStyles = makeStyles(() =>
  createStyles({
    activeOrder: {
      color: '#DE7700',
    },
  }),
)

const Order = (): ReactElement => {
  const classes = useStyles()
  const classesGlobal = useFileManagerGlobalStyles()
  const { fileOrder, setFileOrder } = useContext(FileManagerContext)

  return (
    <div className={classesGlobal.dropdownElementContainer}>
      <OrderIcon />
      <div>Order</div>
      <div className={classesGlobal.dropdownContainer}>
        <div onClick={() => setFileOrder('nameAsc')} className={fileOrder === 'nameAsc' ? classes.activeOrder : ''}>
          Alphabet inc.
        </div>
        <div onClick={() => setFileOrder('nameDesc')} className={fileOrder === 'nameDesc' ? classes.activeOrder : ''}>
          Alphabet dec.
        </div>
        <div onClick={() => setFileOrder('sizeAsc')} className={fileOrder === 'sizeAsc' ? classes.activeOrder : ''}>
          Size inc.
        </div>
        <div onClick={() => setFileOrder('sizeDesc')} className={fileOrder === 'sizeDesc' ? classes.activeOrder : ''}>
          Size dec.
        </div>
        <div onClick={() => setFileOrder('dateAsc')} className={fileOrder === 'dateAsc' ? classes.activeOrder : ''}>
          Date/time inc.
        </div>
        <div onClick={() => setFileOrder('dateDesc')} className={fileOrder === 'dateDesc' ? classes.activeOrder : ''}>
          Date/time dec.
        </div>
      </div>
    </div>
  )
}

export default Order
