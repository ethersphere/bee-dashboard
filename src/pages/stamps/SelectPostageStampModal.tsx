import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Check, Clear } from '@material-ui/icons'
import React, { ReactElement, useState } from 'react'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmSelect } from '../../components/SwarmSelect'
import { EnrichedPostageBatch } from '../../providers/Stamps'

interface Props {
  stamps: EnrichedPostageBatch[]
  onSelect: (stamp: EnrichedPostageBatch) => void
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
)

export function SelectPostageStampModal({ stamps, onSelect, onClose }: Props): ReactElement {
  const [selectedStamp, setSelectedStamp] = useState<EnrichedPostageBatch | null>(null)

  const classes = useStyles()

  function onChange(stampId: string) {
    const stamp = stamps.find(x => x.batchID === stampId)

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
          options={stamps.map(x => ({ label: x.batchID, value: x.batchID }))}
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
