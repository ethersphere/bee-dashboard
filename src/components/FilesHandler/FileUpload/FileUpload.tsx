import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'
import SwarmIcon from '../../../assets/images/swarmIcon.png'
import FileUploadModal from './FileUploadModal'
import { PostageBatch } from '@ethersphere/bee-js'
import CircularProgressBar from './CircularProgressBar'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

interface Props {
  usableStamps: PostageBatch[]
}
const useStyles = makeStyles(() =>
  createStyles({
    circularProgressBar: {
      backgroundColor: '#ffffff4d',
      width: '12px',
      height: '12px',
      position: 'absolute',
      top: '5px',
      right: '5px',
      borderRadius: '50%',
      display: 'flex',
    },
  }),
)

const Upload = ({ usableStamps }: Props): ReactElement => {
  const classes = useStyles()
  const classesGlobal = useFileManagerGlobalStyles()
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedStamp, setSelectedStamp] = useState(usableStamps[0])
  const [uploadingProgress, setUploadingProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files.length > 0) {
      setSelectedFiles(files)
      setIsModalOpen(true)
    }
  }

  const handleUploadClick = (s: PostageBatch) => {
    setSelectedStamp(s)
    const fileInput = document.getElementById('file-upload') as HTMLInputElement

    if (fileInput) {
      fileInput.click()
    }
  }

  const handleUploadProgress = (value: number, isUploadingInProgress: boolean) => {
    setUploadingProgress(value)
    setIsUploading(isUploadingInProgress)

    if (value >= 99) {
      setTimeout(() => {
        setIsUploading(false)
      }, 500)
    }
  }

  return (
    <div className={classesGlobal.dropdownElementContainer} style={{ backgroundColor: '#DE7700', color: '#ffffff' }}>
      {isUploading ? (
        <div className={classes.circularProgressBar}>
          <CircularProgressBar value={uploadingProgress} size={12} customColor="white" thickness={22} />
        </div>
      ) : null}
      <img src={SwarmIcon} alt="" height="16" />
      <div>Upload</div>

      <div className={classesGlobal.dropdownContainer}>
        {usableStamps.map((stamp, index) => (
          <div onClick={() => handleUploadClick(stamp)} key={index}>
            {stamp.label}
          </div>
        ))}
      </div>

      <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
      {isModalOpen && selectedFiles ? (
        <FileUploadModal
          modalDisplay={value => setIsModalOpen(value)}
          files={selectedFiles}
          actualPostageBatch={selectedStamp}
          onUpload={(value: number, isUploadingInProgress: boolean) =>
            handleUploadProgress(value, isUploadingInProgress)
          }
        />
      ) : null}
    </div>
  )
}

export default Upload
