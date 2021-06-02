import React, { ReactElement } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import { PostageBatch } from '@ethersphere/bee-js'
import PeerDetailDrawer from '../../components/PeerDetail'

interface Props {
  stamps: PostageBatch[] | null
  selectedStamp: PostageBatch | null
  setSelected: (stamp: PostageBatch) => void
}

export default function SimpleMenu({ stamps, selectedStamp, setSelected }: Props): ReactElement | null {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  if (!stamps) return null

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Change
      </Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {stamps.map(stamp => (
          <MenuItem
            key={stamp.batchID}
            onClick={() => {
              setSelected(stamp)
              handleClose()
            }}
            selected={stamp.batchID === selectedStamp?.batchID}
          >
            <ListItemIcon>{stamp.utilization}</ListItemIcon>
            <PeerDetailDrawer peerId={stamp.batchID} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
