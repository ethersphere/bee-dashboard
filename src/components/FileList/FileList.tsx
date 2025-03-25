import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import FileItem from './FileItem/FileItem'
import { Context as FileManagerContext } from '../../providers/FileManager'
import { Context as StampContext } from '../../providers/Stamps'
import GroupingLabel from './GroupingLabel'
import { getHumanReadableFileSize } from '../../utils/file'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { FileManagerEvents } from '@solarpunkltd/file-manager-lib'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
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
    groupContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
  }),
)

const sortFiles = (a: FileInfo, b: FileInfo, sortType: string): number => {
  switch (sortType) {
    case 'nameAsc':
      return a.name?.localeCompare(b.name)
    case 'nameDesc':
      return b.name?.localeCompare(a.name)
    case 'sizeAsc':
      return a?.customMetadata?.size && b?.customMetadata?.size
        ? Number(a.customMetadata.sizeInBytes) - Number(b?.customMetadata?.sizeInBytes)
        : 0
    case 'sizeDesc':
      return a?.customMetadata?.size && b?.customMetadata?.size
        ? Number(b.customMetadata.sizeInBytes) - Number(a?.customMetadata?.sizeInBytes)
        : 0
    case 'dateAsc':
      return a?.customMetadata?.date && b?.customMetadata?.date
        ? Number(a.customMetadata.date) - Number(b?.customMetadata?.date)
        : 0
    case 'dateDesc':
      return a?.customMetadata?.date && b?.customMetadata?.date
        ? Number(b.customMetadata.date) - Number(a?.customMetadata?.date)
        : 0

    default:
      return 0
  }
}

const FileList = (): ReactElement => {
  const classes = useStyles()
  const { filemanager, initialized, selectedBatchIds, isGroupingOn } = useContext(FileManagerContext)
  const [fileList, setFileList] = useState<FileInfo[]>([])
  const { usableStamps } = useContext(StampContext)
  const { fileOrder } = useContext(FileManagerContext)

  useEffect(() => {
    if (filemanager && initialized) {
      const allFiles = filemanager.fileInfoList

      if (selectedBatchIds.length === 0) {
        setFileList(allFiles)
      } else {
        const filesPerVolume = allFiles.filter(fi =>
          selectedBatchIds.some(batchId => fi.batchId.toString() === batchId.toString()),
        )
        setFileList(filesPerVolume)
      }
    }
  }, [filemanager, initialized, selectedBatchIds])

  useEffect(() => {
    if (filemanager) {
      const handleFileUploaded = (data: FileInfo) => {
        setFileList(prev => [...prev, data])
      }

      filemanager.emitter.on(FileManagerEvents.FILE_UPLOADED, handleFileUploaded)

      return () => {
        filemanager.emitter.off(FileManagerEvents.FILE_UPLOADED, handleFileUploaded)
      }
    }
  }, [filemanager])

  return (
    <div className={classes.container}>
      {fileList.length > 0 ? (
        <div className={classes.fileListContainer}>
          {isGroupingOn
            ? selectedBatchIds.map((batchId, batchIndex) => (
                <div key={batchIndex} className={classes.groupContainer}>
                  <GroupingLabel
                    label={
                      usableStamps.find(item => item?.batchID?.toString() === batchId.toString())?.label ??
                      'No volume name'
                    }
                  />
                  {fileList
                    .sort((a, b) => sortFiles(a, b, fileOrder))
                    .map((file, index) => {
                      if (file.batchId.toString() === batchId.toString()) {
                        return (
                          <div key={index}>
                            <FileItem
                              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                              volumeName={
                                usableStamps.find(item => item?.batchID?.toString() === file?.batchId?.toString())
                                  ?.label ?? 'No volume name'
                              }
                              volumeValidity={
                                usableStamps
                                  .find(item => item?.batchID?.toString() === file?.batchId?.toString())
                                  ?.duration.toEndDate() ?? new Date()
                              }
                              name={file?.name || 'No name'}
                              type={file.customMetadata?.type ? file.customMetadata.type : 'other'}
                              size={getHumanReadableFileSize(
                                Number(file.customMetadata?.size ? file.customMetadata.size : ''),
                              )}
                              hash={file.file.reference}
                              expires={file.customMetadata?.valid ? file.customMetadata.valid : ''}
                              preview={file.customMetadata?.preview ? file.customMetadata.preview : ''}
                              description={file.customMetadata?.description === 'true'}
                              label={file.customMetadata?.label}
                              details={file.customMetadata?.details}
                              shared={
                                file.customMetadata?.shared === 'me' || file.customMetadata?.shared === 'others'
                                  ? file.customMetadata.shared
                                  : undefined
                              }
                              warning={file.customMetadata?.warning === 'true'}
                              addedToQueue={file.customMetadata?.addedToQueue === 'true'}
                            ></FileItem>
                          </div>
                        )
                      }
                    })}
                </div>
              ))
            : fileList
                .sort((a, b) => sortFiles(a, b, fileOrder))
                .map((file, index) => (
                  <div key={index}>
                    <FileItem
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      volumeName={
                        usableStamps.find(item => item?.batchID?.toString() === file?.batchId?.toString())?.label ??
                        'No volume name'
                      }
                      volumeValidity={
                        usableStamps
                          .find(item => item?.batchID?.toString() === file?.batchId?.toString())
                          ?.duration.toEndDate() ?? new Date()
                      }
                      name={file?.name || 'No name'}
                      type={file.customMetadata?.type ? file.customMetadata.type : 'other'}
                      size={getHumanReadableFileSize(Number(file.customMetadata?.size ? file.customMetadata.size : ''))}
                      hash={file.file?.reference ? file.file.reference.toString() : ''}
                      expires={file.customMetadata?.valid ? file.customMetadata.valid : ''}
                      preview={file.customMetadata?.preview ? file.customMetadata.preview : ''}
                      description={file.customMetadata?.description === 'true'}
                      label={file.customMetadata?.label}
                      details={file.customMetadata?.details}
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
      ) : (
        <div className={classes.noFilesText}>There’re no items!</div>
      )}
    </div>
  )
}

export default FileList
