/* eslint-disable no-alert */
import type { ReactElement } from 'react'
import { useState } from 'react'
import MoreFillIcon from 'remixicon-react/MoreFillIcon'
import ManageVolumesModal from './ManageVolumesModal'
import { useFileManagerGlobalStyles } from '../../../styles/globalFileManagerStyles'

const VolumeManage = (): ReactElement => {
  const classes = useFileManagerGlobalStyles()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div>
      <div className={classes.filesHandlerItemContainer} onClick={() => setIsModalOpen(true)}>
        <MoreFillIcon size={16} />
        <div>Manage</div>
      </div>
      {isModalOpen && <ManageVolumesModal modalDisplay={(value: boolean) => setIsModalOpen(value)} />}
    </div>
  )
}

export default VolumeManage
