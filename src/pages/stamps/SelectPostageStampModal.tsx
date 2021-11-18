import { FormControl, MenuItem, Select } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { Check, Clear } from '@material-ui/icons'
import React, { ReactElement, useState } from 'react'
import { EnrichedPostageBatch } from '../../providers/Stamps'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing(1),
      position: 'relative',
    },
    field: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    buttonProgress: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginBottom: -12,
    },
  }),
)

interface Props {
  stamps: EnrichedPostageBatch[]
  onSelect: (stamp: EnrichedPostageBatch) => void
  onClose: () => void
}

export function SelectPostageStampModal({ stamps, onSelect, onClose }: Props): ReactElement {
  const classes = useStyles()

  const [selectedStamp, setSelectedStamp] = useState<EnrichedPostageBatch | null>(null)

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
    <Dialog open={true} onClose={() => onClose()} aria-labelledby="form-dialog-title" fullWidth>
      <DialogTitle id="form-dialog-title">Select postage stamp</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <Select onChange={event => onChange(event.target.value as string)} fullWidth>
            {stamps.map(x => (
              <MenuItem key={x.batchID} value={x.batchID}>
                {x.batchID}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        {selectedStamp ? (
          <div className={classes.wrapper}>
            <Button onClick={() => onFinish()} variant="contained" startIcon={<Check />}>
              Select
            </Button>
          </div>
        ) : null}
        <Button onClick={() => onClose()} variant="contained" startIcon={<Clear />}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}
