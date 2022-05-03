import { Button, ListItemIcon, Menu, MenuItem, Typography } from '@material-ui/core'
import React, { ReactElement } from 'react'
import { EnrichedPostageBatch } from '../../providers/Stamps'

interface Props {
  stamps: EnrichedPostageBatch[] | null
  selectedStamp: EnrichedPostageBatch | null
  setSelected: (stamp: EnrichedPostageBatch) => void
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
      <Button variant="contained" aria-haspopup="true" onClick={handleClick}>
        Change
      </Button>
      <Menu anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
        {stamps.map(stamp => (
          <MenuItem
            key={stamp.batchID}
            onClick={() => {
              setSelected(stamp)
              handleClose()
            }}
            selected={stamp.batchID === selectedStamp?.batchID}
          >
            <ListItemIcon>{stamp.usageText}</ListItemIcon>
            <Typography variant="body2">{stamp.batchID.slice(0, 8)}[…]</Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  )
}
