import { Check, Clear } from '@mui/icons-material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { ReactElement, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmSelect } from '../../components/SwarmSelect'
import { EnrichedPostageBatch } from '../../providers/Stamps'

interface Props {
  stamps: EnrichedPostageBatch[]
  onSelect: (stamp: EnrichedPostageBatch) => void
  onClose: () => void
}

const useStyles = makeStyles()(theme => ({
  dialog: {
    background: theme.palette.background.default,
    borderRadius: 0,
    width: '100%',
    maxWidth: '890px',
  },
  title: {
    color: '#606060',
    textAlign: 'center',
  },
  hint: {
    marginBottom: '16px',
  },
}))

export function SelectPostageStampModal({ stamps, onSelect, onClose }: Props): ReactElement {
  const [selectedStamp, setSelectedStamp] = useState<EnrichedPostageBatch | null>(null)

  const { classes } = useStyles()

  function onChange(stampId: string) {
    const stamp = stamps.find(x => x.batchID.toHex() === stampId)

    if (stamp) {
      setSelectedStamp(stamp)
    }
  }

  function onFinish() {
    if (selectedStamp) {
      onSelect(selectedStamp)
      onClose()
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      PaperProps={{ className: classes.dialog }}
    >
      <DialogTitle id="form-dialog-title" className={classes.title}>
        Select postage stamp
      </DialogTitle>
      <DialogContent>
        <SwarmSelect
          options={stamps.map(x => ({ label: x.batchID.toHex(), value: x.batchID.toHex() }))}
          onChange={event => onChange(event.target.value as string)}
        />
      </DialogContent>
      <DialogContent>
        <ExpandableListItemActions>
          <Button disabled={!selectedStamp} onClick={onFinish} variant="contained" startIcon={<Check />}>
            Select
          </Button>
          <Button onClick={onClose} variant="contained" startIcon={<Clear />}>
            Cancel
          </Button>
        </ExpandableListItemActions>
      </DialogContent>
    </Dialog>
  )
}
