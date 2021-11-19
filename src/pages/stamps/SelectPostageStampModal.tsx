import { Box, createStyles, FormControl, makeStyles, MenuItem, Select, Theme, Typography } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Check, Clear } from '@material-ui/icons'
import React, { ReactElement, useState } from 'react'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
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
    select: {
      background: theme.palette.background.paper,
      borderRadius: 0,
      border: 0,
    },
    option: {
      height: '52px',
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
      onClose={() => onClose()}
      aria-labelledby="form-dialog-title"
      fullWidth
      PaperProps={{ className: classes.dialog }}
    >
      <DialogTitle id="form-dialog-title" className={classes.title}>
        Select postage stamp
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <Select
            onChange={event => onChange(event.target.value as string)}
            fullWidth
            variant="outlined"
            className={classes.select}
          >
            {stamps.map(x => (
              <MenuItem key={x.batchID} value={x.batchID} className={classes.option}>
                {x.batchID.slice(0, 8)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <Box mb={2}>
        <DialogContent>
          <ExpandableListItemActions>
            <Button disabled={!selectedStamp} onClick={() => onFinish()} variant="contained" startIcon={<Check />}>
              Select
            </Button>
            <Button onClick={() => onClose()} variant="contained" startIcon={<Clear />}>
              Cancel
            </Button>
          </ExpandableListItemActions>
        </DialogContent>
      </Box>
      <DialogContent>
        <Typography variant="body2" className={classes.hint}>
          Please refer to the{' '}
          <a
            href="https://docs.ethswarm.org/docs/access-the-swarm/keep-your-data-alive#purchase-a-batch-of-stamps"
            target="_blank"
            rel="noreferrer"
          >
            official Bee documentation
          </a>{' '}
          to understand these values.
        </Typography>
      </DialogContent>
    </Dialog>
  )
}
