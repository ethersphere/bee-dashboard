import { createStyles, makeStyles } from '@material-ui/core'

import { ReactElement, useContext } from 'react'
import FileUpload from './FileUpload/FileUpload'
import VolumeManage from './VolumeManage/VolumeManage'
import { Context as StampContext } from '../providers/Stamps'
import Volume from './VolumeManage/Volume'
import { Context as FileManagerContext } from '../providers/FileManager'
import { BatchId } from '@upcoming/bee-js'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      height: '65px',
      boxSizing: 'border-box',
      fontSize: '12px',
      display: 'flex',
      gap: '10px',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      marginBottom: '20px',
    },
    flex: {
      display: 'flex',
      height: '100%',
    },
  }),
)

const FilesHandler = (): ReactElement => {
  const classes = useStyles()
  const { usableStamps } = useContext(StampContext)
  const { selectedBatchIds, setSelectedBatchIds } = useContext(FileManagerContext)

  const handlerSelectedBatchIds = (batchId: BatchId, isSelected: boolean) => {
    const newSelectedBatchIds = Array.from(selectedBatchIds)

    const ix = newSelectedBatchIds.findIndex(item => item.toString() === batchId.toString())

    if (isSelected && ix === -1) {
      newSelectedBatchIds.push(batchId)
    } else {
      newSelectedBatchIds.splice(ix, 1)
    }

    setSelectedBatchIds(newSelectedBatchIds)
  }

  return (
    <div className={classes.container}>
      <div className={classes.flex}>
        {usableStamps?.map((stamp, index) => (
          <div key={index} className={classes.flex}>
            <Volume
              label={stamp.label}
              size={stamp.amount}
              validity={stamp.duration.toEndDate(new Date()).getTime()}
              notificationText="!"
              onClick={isSelected => handlerSelectedBatchIds(stamp.batchID, isSelected)}
            />
          </div>
        ))}
        <VolumeManage />
      </div>
      <div className={classes.flex}>
        <FileUpload usableStamps={usableStamps} />
      </div>
    </div>
  )
}

export default FilesHandler
