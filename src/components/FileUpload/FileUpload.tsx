import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'
import SwarmIcon from '../../assets/images/swarmIcon.png'
import FileUploadModal from './FileUploadModal'
import { PostageBatch } from '@upcoming/bee-js'
//TODO-Filemanager: volume management

interface Props {
  usableStamps: PostageBatch[]
}
const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      backgroundColor: '#DE7700',
      fontSize: '12px',
      fontFamily: '"iAWriterMonoV", monospace',
      width: '65px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      color: '#FCFCFC',
      '&:hover': {
        backgroundColor: '#DE7700',
      },
      '&:hover $dropdown': {
        display: 'flex',
      },
    },
    dropdown: {
      display: 'none',
      backgroundColor: '#ffffff',
      position: 'absolute',
      top: '100%',
      zIndex: 1,
      width: '90px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      color: '#333333',
      '& div': {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      },
      '& div:hover': {
        backgroundColor: '#DE7700',
        color: '#ffffff',
      },
    },
  }),
)

const Upload = ({ usableStamps }: Props): ReactElement => {
  const classes = useStyles()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files.length > 0) {
      const file = files[0]
      setSelectedFile(file)
      setIsModalOpen(true)
    }
  }

  const handleUploadClick = () => {
    const fileInput = document.getElementById('file-upload') as HTMLInputElement

    if (fileInput) {
      fileInput.click()
    }
  }

  return (
    <div className={classes.container}>
      <img src={SwarmIcon} alt="" height="16" />
      <div>Upload</div>

      <div className={classes.dropdown}>
        {usableStamps.map((stamp, index) => (
          <div onClick={handleUploadClick} key={index}>
            {stamp.label}
          </div>
        ))}
      </div>

      <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
      {isModalOpen && selectedFile ? (
        <FileUploadModal modalDisplay={value => setIsModalOpen(value)} file={selectedFile} />
      ) : null}
    </div>
  )
}

export default Upload
