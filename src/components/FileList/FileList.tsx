import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useContext, useEffect, useState } from 'react'
import FileItem from './FileItem/FileItem'
import { Context as FileManagerContext } from '../../providers/FileManager'
import { Context as SettingsContext } from '../../providers/Settings'
import GroupingLabel from './GroupingLabel'
import { getHumanReadableFileSize, getUsableStamps } from '../../utils/file'
import { FileInfo } from '@solarpunkltd/file-manager-lib'
import { FileManagerEvents } from '@solarpunkltd/file-manager-lib'
import { BatchId, PostageBatch } from '@ethersphere/bee-js'

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
      return a.name.localeCompare(b.name)
    case 'nameDesc':
      return b.name.localeCompare(a.name)
    case 'sizeAsc':
      return a?.customMetadata?.size && b?.customMetadata?.size
        ? Number(a.customMetadata.size) - Number(b?.customMetadata?.size)
        : 0
    case 'sizeDesc':
      return a?.customMetadata?.size && b?.customMetadata?.size
        ? Number(b.customMetadata.size) - Number(a?.customMetadata?.size)
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
  const { filemanager, selectedBatchIds, isGroupingOn, isNewVolumeCreated } = useContext(FileManagerContext)
  const [fileList, setFileList] = useState<FileInfo[]>([])
  const [usableStamps, setUStamps] = useState<PostageBatch[]>([])
  const { fileOrder } = useContext(FileManagerContext)
  const { beeApi } = useContext(SettingsContext)
  const filesUnderVolumes = (allFiles: FileInfo[], selectedBatchIds: BatchId[]) => {
    if (selectedBatchIds.length === 0) {
      setFileList(allFiles)
    } else {
      const filesPerVolume = allFiles.filter(fi =>
        selectedBatchIds.some(batchId => fi.batchId.toString() === batchId.toString()),
      )
      setFileList(filesPerVolume)
    }
  }

  useEffect(() => {
    if (filemanager) {
      const allFiles = filemanager.fileInfoList
      for (const file of allFiles) {
        // eslint-disable-next-line no-console
        console.log('File', file.name)
      }

      filesUnderVolumes(allFiles, selectedBatchIds)
    }
  }, [filemanager, selectedBatchIds])

  useEffect(() => {
    if (filemanager) {
      const handleFileUploaded = (_: FileInfo) => {
        filesUnderVolumes(filemanager.fileInfoList, selectedBatchIds)
      }

      filemanager.emitter.on(FileManagerEvents.FILE_UPLOADED, handleFileUploaded)

      return () => {
        filemanager.emitter.off(FileManagerEvents.FILE_UPLOADED, handleFileUploaded)
      }
    }
  }, [filemanager, selectedBatchIds])

  useEffect(() => {
    const getUStamps = async () => {
      const usableStamps = await getUsableStamps(beeApi)
      setUStamps([...usableStamps])
    }
    getUStamps()
  }, [beeApi, isNewVolumeCreated])

  return (
    <div className={classes.container}>
      {fileList.length > 0 ? (
        <div className={classes.fileListContainer}>
          {isGroupingOn
            ? //TODO This needs to be refactored
              selectedBatchIds.map((batchId, batchIndex) => (
                <div key={batchIndex} className={classes.groupContainer}>
                  <GroupingLabel
                    label={usableStamps.find(item => item.batchID.toString() === batchId.toString())?.label}
                  />
                  {fileList
                    .sort((a, b) => sortFiles(a, b, fileOrder))
                    .map((file, index) => {
                      // eslint-disable-next-line no-console
                      console.log('bagoy file.owner: ', file.owner.toString())
                      // eslint-disable-next-line no-console
                      console.log('bagoy file.actPublisher: ', file.actPublisher.toString())

                      if (file.batchId.toString() === batchId.toString()) {
                        return (
                          <div key={index}>
                            <FileItem
                              batchId={file.batchId.toString()}
                              owner={file.owner.toString()}
                              actPublisher={file.actPublisher.toString()}
                              historyHash={file.file.historyRef.toString()}
                              volumeName={
                                usableStamps.find(item => item.batchID.toString() === file.batchId.toString())?.label ||
                                file.batchId.toString()
                              }
                              volumeValidity={
                                usableStamps
                                  .find(item => item.batchID.toString() === file.batchId.toString())
                                  ?.duration.toEndDate() || new Date(0)
                              }
                              name={file.name}
                              type={file.customMetadata?.type ? file.customMetadata.type : 'other'}
                              size={getHumanReadableFileSize(
                                Number(file.customMetadata?.size ? file.customMetadata.size : '0'),
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
                .map((file, index) => {
                  // eslint-disable-next-line no-console
                  console.log('bagoy file.owner: ', file.owner.toString())

                  return (
                    <div key={index}>
                      <FileItem
                        batchId={file.batchId.toString()}
                        owner={file.owner.toString()}
                        actPublisher={file.actPublisher.toString()}
                        historyHash={file.file.historyRef.toString()}
                        volumeName={
                          usableStamps.find(item => item.batchID.toString() === file.batchId.toString())?.label ||
                          'No volume name'
                        }
                        volumeValidity={
                          usableStamps
                            .find(item => item.batchID.toString() === file.batchId.toString())
                            ?.duration.toEndDate() || new Date(0)
                        }
                        name={file.name}
                        type={file.customMetadata?.type ? file.customMetadata.type : 'other'}
                        size={getHumanReadableFileSize(
                          Number(file.customMetadata?.size ? file.customMetadata.size : ''),
                        )}
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
                  )
                })}
        </div>
      ) : (
        <div className={classes.noFilesText}>There’re no items!</div>
      )}
    </div>
  )
}

export default FileList
