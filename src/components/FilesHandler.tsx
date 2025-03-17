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
  const { choosedBatchIds, setChoosedBatchIds } = useContext(FileManagerContext)

  const handlerChoosedBatchIds = (batchId: BatchId, isChoosed: boolean) => {
    const newChoosedBatchIds = Array.from(choosedBatchIds)

    if (isChoosed) {
      newChoosedBatchIds.push(batchId)
    } else {
      newChoosedBatchIds.splice(
        newChoosedBatchIds.findIndex(item => item.toString() === batchId.toString()),
        1,
      )
    }

    setChoosedBatchIds(newChoosedBatchIds)
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
              onClick={isChoosed => handlerChoosedBatchIds(stamp.batchID, isChoosed)}
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
