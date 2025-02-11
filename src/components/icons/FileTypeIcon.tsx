import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import ImageLineIcon from 'remixicon-react/ImageLineIcon'
import DraftFillIcon from 'remixicon-react/DraftFillIcon'
import File2FillIcon from 'remixicon-react/File2FillIcon'
import VideoIcon from './VideoIcon'
import AudioIcon from './AudioIcon'
import FolderIcon from './FolderIcon'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
    },
  }),
)

interface Props {
  type: string
  // type: 'video' | 'audio' | 'image' | 'document' | 'folder' | 'other'
}

const FileTypeIcon = ({ type }: Props): ReactElement => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      {type === 'video' && <VideoIcon />}
      {type === 'audio' && <AudioIcon />}
      {type === 'image' && <ImageLineIcon size="20" />}
      {type === 'document' && <DraftFillIcon size="20" />}
      {type === 'folder' && <FolderIcon />}
      {type === 'other' && <File2FillIcon size="20" />}
    </div>
  )
}

export default FileTypeIcon
