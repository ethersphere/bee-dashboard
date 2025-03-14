import { ReactElement, useContext, useEffect, useState } from 'react'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { createStyles, makeStyles, Typography } from '@material-ui/core'
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
  const [fileList, setFileList] = useState<FileInfo[] | null>(filemanager ? [...filemanager.getFileInfoList()] : null)
  const [fileListError, setFileListError] = useState(false)

  useEffect(() => {
    function fetchFiles() {
      if (filemanager && initialized) {
        try {
          const files = filemanager.getFileInfoList()
          setFileList(files ? files : [])
        } catch (error) {
          setFileListError(true)
        }
      }
    }
    fetchFiles()
  }, [filemanager, fileList, initialized])

  useEffect(() => {
    const handleFileUploaded = (data: FileInfo) => {
      setFileList(fileList ? [...fileList, data] : [])
    }

    if (filemanager) {
      filemanager.emitter.on(FileManagerEvents.FILE_UPLOADED, handleFileUploaded)
    }

    return () => {
      filemanager?.emitter.off(FileManagerEvents.FILE_UPLOADED, handleFileUploaded)
    }
  }, [filemanager])

  return (
    <div>
      <FilesHandler />
      {fileList ? fileList.length === 0 && <div className={classes.noFilesText}>There’re no items!</div> : null}
      {fileList
        ? fileList.length > 0 && (
            <div className={classes.fileListContainer}>
              {fileList?.map((file, index) => (
                <div key={index}>
                  <FileItem
                    name={file.name ? file.name : ''}
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
                    hash={file.file?.reference ? file.file.reference.toString() : ''}
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
          )
        : null}
      {fileListError && (
        <div className={classes.errorTextContainer}>
          <Typography variant="h1" align="center">
            Uh oh, an error happened
          </Typography>
        </div>
      )}
    </div>
  )
}
