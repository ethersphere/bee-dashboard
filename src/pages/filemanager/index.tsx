import { ReactElement, useContext, useEffect, useState } from 'react'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { createStyles, makeStyles } from '@material-ui/core'
import FileItem from '../../components/FileItem'
import FilesHandler from '../../components/FilesHandler'
import { Context as FileManagerContext } from '../../providers/FileManager'
import { FileManagerEvents } from '@solarpunkltd/file-manager-lib'

const useStyles = makeStyles(() =>
  createStyles({
    errorTextContainer: {
      display: 'flex',
      gap: '10px',
    },
    noFilesText: {
      width: '100%',
      textAlign: 'center',
      marginTop: '200px',
      fontFamily: '"iAWriterMonoV", monospace',
      fontSize: '18px',
    },
    fileListContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    flexDisplay: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
    },
  }),
)
export default function FM(): ReactElement {
  const { filemanager, initialized } = useContext(FileManagerContext)
  const classes = useStyles()
  const [fileList, setFileList] = useState<FileInfo[]>([])

  useEffect(() => {
    if (!filemanager || !initialized) {
      return
    }

    const files = filemanager.getFileInfoList()
    setFileList(files)
  }, [filemanager, initialized])

  useEffect(() => {
    if (!filemanager) {
      return
    }

    const listener = (e: FileInfo) => {
      setFileList([...fileList, e])
    }

    filemanager.emitter.on(FileManagerEvents.FILE_UPLOADED, listener)

    return () => {
      filemanager.emitter.off(FileManagerEvents.FILE_UPLOADED, listener)
    }
  }, [filemanager, fileList])

  return (
    <div>
      <FilesHandler />
      {fileList.length === 0 && <div className={classes.noFilesText}>There’re no items!</div>}
      {fileList.length > 0 && (
        <div className={classes.fileListContainer}>
          {fileList.map((file, index) => (
            <div key={index}>
              <FileItem
                name={file.customMetadata?.name ? file.customMetadata.name : ''}
                type={
                  file.customMetadata?.type === 'video' ||
                  file.customMetadata?.type === 'audio' ||
                  file.customMetadata?.type === 'image' ||
                  file.customMetadata?.type === 'document' ||
                  file.customMetadata?.type === 'folder' ||
                  file.customMetadata?.type === 'other'
                    ? file.customMetadata.type
                    : 'other'
                }
                size={file.customMetadata?.size ? file.customMetadata.size : ''}
                hash={'bagoy'}
                expires={file.customMetadata?.valid ? file.customMetadata.valid : ''}
                preview={file.customMetadata?.preview ? file.customMetadata.preview : ''}
                description={file.customMetadata?.description === 'true'}
                label={file.customMetadata?.label}
                shared={
                  file.customMetadata?.shared === 'me' || file.customMetadata?.shared === 'others'
                    ? file.customMetadata.shared
                    : undefined
                }
                warning={file.customMetadata?.warning === 'true'}
                addedToQueue={file.customMetadata?.addedToQueue === 'true'}
              ></FileItem>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
