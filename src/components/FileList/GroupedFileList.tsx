import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import FileItem from './FileItem/FileItem'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { getFileItemProps, sortFiles } from './FileList'
import { PostageBatch } from '@ethersphere/bee-js'
import { getUsableStamps } from '../../utils/file'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as FileManagerContext } from '../../providers/FileManager'
import GroupingLabel from './GroupingLabel'
import { createStyles, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    groupContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
  }),
)

interface GroupedFileListProps {
  fileList: FileInfo[]
  fileOrder: string
}

const GroupedFileList = ({ fileList, fileOrder }: GroupedFileListProps): ReactElement => {
  const classes = useStyles()
  const [usableStamps, setUsableStampsStamps] = useState<PostageBatch[]>([])
  const { beeApi } = useContext(SettingsContext)
  const { isNewVolumeCreated, selectedBatchIds } = useContext(FileManagerContext)

  useEffect(() => {
    const getStamps = async () => {
      const usableStamps = await getUsableStamps(beeApi)
      setUsableStampsStamps([...usableStamps])
    }
    getStamps()
  }, [beeApi, isNewVolumeCreated])

  return (
    <div className={classes.container}>
      {selectedBatchIds.map((batchId, batchIndex) => (
        <div key={batchIndex} className={classes.groupContainer}>
          <GroupingLabel label={usableStamps.find(item => item.batchID.toString() === batchId.toString())?.label} />
          {fileList
            .sort((a, b) => sortFiles(a, b, fileOrder))
            .map((file, index) => {
              if (file.batchId.toString() === batchId.toString()) {
                return (
                  <div key={index}>
                    <FileItem {...getFileItemProps(file, usableStamps)}></FileItem>
                  </div>
                )
              }
            })}
        </div>
      ))}
    </div>
  )
}

export default GroupedFileList
