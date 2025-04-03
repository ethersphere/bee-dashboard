import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import FileItem from './FileItem/FileItem'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { getFileItemProps, sortFiles } from './FileList'
import { PostageBatch } from '@ethersphere/bee-js'
import { getUsableStamps } from '../../utils/file'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as FileManagerContext } from '../../providers/FileManager'
import { createStyles, makeStyles } from '@material-ui/core'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
  }),
)

interface FlatFileListProps {
  fileList: FileInfo[]
  fileOrder: string
}

const FlatFileList = ({ fileList, fileOrder }: FlatFileListProps): ReactElement => {
  const classes = useStyles()
  const [usableStamps, setUsableStampsStamps] = useState<PostageBatch[]>([])
  const { beeApi } = useContext(SettingsContext)
  const { isNewVolumeCreated } = useContext(FileManagerContext)

  useEffect(() => {
    const getStamps = async () => {
      const usableStamps = await getUsableStamps(beeApi)
      setUsableStampsStamps([...usableStamps])
    }
    getStamps()
  }, [beeApi, isNewVolumeCreated])

  return (
    <div className={classes.container}>
      {fileList
        .sort((a, b) => sortFiles(a, b, fileOrder))
        .map((file, index) => (
          <div key={index}>
            <FileItem {...getFileItemProps(file, usableStamps)}></FileItem>
          </div>
        ))}
    </div>
  )
}

export default FlatFileList
