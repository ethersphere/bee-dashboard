/* eslint-disable no-alert */
import { createStyles, makeStyles } from '@material-ui/core'
import type { ReactElement } from 'react'
import { useState } from 'react'
import MoreFillIcon from 'remixicon-react/MoreFillIcon'
import ManageVolumesModal from './ManageVolumesModal'

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'relative',
      backgroundColor: '#ffffff',
      fontSize: '12px',
      display: 'flex',
      width: '65px',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      fontFamily: '"iAWriterMonoV", monospace',
      '&:hover': {
        backgroundColor: '#f0f0f0',
      },
    },
  }),
)

const VolumeManage = (): ReactElement => {
  const classes = useStyles()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <div className={classes.container} onClick={() => setIsModalOpen(true)}>
        <MoreFillIcon size={16} />
        <div>Manage</div>
      </div>
      {isModalOpen && <ManageVolumesModal modalDisplay={(value: boolean) => setIsModalOpen(value)} />}
    </div>
  )
}

export default VolumeManage
