import { createStyles, makeStyles } from '@material-ui/core'

import { ReactElement, useContext, useEffect, useState } from 'react'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as FileManagerContext } from '../../providers/FileManager'
import { BatchId, PostageBatch } from '@ethersphere/bee-js'
import Volume from './VolumeManage/Volume'
import VolumeManage from './VolumeManage/VolumeManage'
import FileUpload from './FileUpload/FileUpload'
import Grouping from './Grouping'
import Order from './Order/Order'
import Download from './Download'
import { getUsableStamps } from '../../utils/file'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      height: '65px',
      boxSizing: 'border-box',
      fontSize: '12px',
      display: 'flex',
      gap: '5px',
      justifyContent: 'right',
      alignItems: 'center',
      marginBottom: '20px',
    },
    flex: {
      display: 'flex',
      height: '100%',
      backgroundColor: 'white',
    },
    leftContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'right',
    },
  }),
)

const FilesHandler = (): ReactElement => {
  const classes = useStyles()
  const [usableStamps, setUsableStamps] = useState<PostageBatch[]>([])
  const { selectedBatchIds, setSelectedBatchIds, isNewVolumeCreated } = useContext(FileManagerContext)
  const { beeApi } = useContext(SettingsContext)

  useEffect(() => {
    const getStamps = async () => {
      const stamps = await getUsableStamps(beeApi)
      setUsableStamps([...stamps])
    }
    getStamps()
  }, [beeApi, isNewVolumeCreated])

  const handlerSelectedBatchIds = (batchId: BatchId, isSelected: boolean) => {
    const newSelectedBatchIds = Array.from(selectedBatchIds)

    const ix = newSelectedBatchIds.findIndex(item => item.toString() === batchId.toString())

    if (isSelected && ix !== -1) {
      newSelectedBatchIds.splice(0, newSelectedBatchIds.length)
      newSelectedBatchIds.push(batchId)
    } else if (isSelected && ix === -1) {
      newSelectedBatchIds.push(batchId)
    } else {
      newSelectedBatchIds.splice(ix, 1)

      if (newSelectedBatchIds.length === 0) {
        usableStamps.forEach(stamp => {
          newSelectedBatchIds.push(stamp.batchID)
        })
      }
    }

    setSelectedBatchIds(newSelectedBatchIds)
  }

  return (
    <div className={classes.container}>
      <div className={`${classes.flex} ${classes.leftContainer}`}>
        <Grouping />
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
        <Download />
        <FileUpload usableStamps={usableStamps} />
        <Order />
      </div>
    </div>
  )
}

export default FilesHandler
