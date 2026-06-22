import {
  Bee,
  BZZ,
  capacityBreakpoints,
  Duration,
  PostageBatch,
  RedundancyLevel,
  Size,
  Utils,
} from '@ethersphere/bee-js'
import { Box, CircularProgress, Divider, MenuItem, Select, Typography } from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Input from '@mui/material/Input'
import { useSnackbar } from 'notistack'
import React, { ReactElement, ReactNode, useContext, useEffect, useState } from 'react'
import { makeStyles } from 'tss-react/mui'

import { CheckState, Context as BeeContext } from '../providers/Bee'
import { preciseTimeString } from '../utils'
import { getHumanReadableFileSize } from '../utils/file'

const useStyles = makeStyles()(theme => ({
  buttonSelected: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: 'white',
      '@media (hover: none)': {
        color: 'white',
        backgroundColor: theme.palette.primary.main,
      },
    },
  },
  buttonUnselected: {
    color: '#dd7700',
    backgroundColor: 'white',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  depthButton: {
    marginRight: 8,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}))

export enum StampExtensionType {
  Topup = 'Topup',
  Dilute = 'Dilute',
}

interface Props {
  type: StampExtensionType
  icon: ReactNode
  bee: Bee
  stamp: PostageBatch
  status: CheckState
}

const DILUTE_MAX_STEPS = 5
const DILUTE_ENCRYPTION_KEY = 'ENCRYPTION_OFF'

function getAvailableSizes(stampDepth: number): number[] {
  const depthEntries = capacityBreakpoints[DILUTE_ENCRYPTION_KEY][RedundancyLevel.OFF]
  const currentDepthIndex = depthEntries.findIndex(entry => entry.batchDepth === stampDepth)

  if (currentDepthIndex === -1) return []

  return depthEntries
    .slice(currentDepthIndex + 1, currentDepthIndex + 1 + DILUTE_MAX_STEPS)
    .map(entry => Utils.getStampEffectiveBytes(entry.batchDepth, false, RedundancyLevel.OFF))
}

function getProjectedActualBytes(
  newEffectiveBytes: number,
  currentEffectiveBytes: number,
  currentActualBytes: number,
): number {
  if (currentEffectiveBytes === 0) return newEffectiveBytes

  return Math.round(currentActualBytes * (newEffectiveBytes / currentEffectiveBytes))
}

function isBalanceInsufficient(cost: BZZ | null, bzzBalance: BZZ | null | undefined): boolean {
  return Boolean(cost && bzzBalance && cost.gte(bzzBalance))
}

function formatCost(cost: BZZ | null, insufficient: boolean): string {
  if (!cost) return '-'

  return `${cost.toSignificantDigits(4)} xBZZ${insufficient ? ' (insufficient balance)' : ''}`
}

export default function StampExtensionModal({ type, icon, bee, stamp, status }: Props): ReactElement {
  const { classes } = useStyles()
  const [open, setOpen] = useState<boolean>(false)
  const [daysInput, setDaysInput] = useState<string>('1')
  const [selectedNewSizeBytes, setSelectedNewSizeBytes] = useState<number | null>(null)
  const [topupCostBzz, setTopupCostBzz] = useState<BZZ | null>(null)
  const [diluteCostBzz, setDiluteCostBzz] = useState<BZZ | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const { walletBalance } = useContext(BeeContext)

  // Topup calculations
  const parsedDays = parseInt(daysInput, 10)
  const topupValid = !isNaN(parsedDays) && parsedDays >= 1
  const newTtlAfterTopup = topupValid ? Number(stamp.duration.toSeconds()) + parsedDays * 86400 : null

  useEffect(() => {
    if (!topupValid) {
      setTopupCostBzz(null)

      return
    }

    let cancelled = false

    bee
      .getDurationExtensionCost(stamp.batchID, Duration.fromDays(parsedDays))
      .then(cost => {
        if (!cancelled) setTopupCostBzz(cost)
      })
      .catch(() => {
        if (!cancelled) setTopupCostBzz(null)
      })

    return () => {
      cancelled = true
    }
  }, [parsedDays, topupValid, bee, stamp.batchID])

  // Dilute calculations
  const currentCapacityBytes = stamp.size.toBytes()
  const currentEffectiveBytes = Utils.getStampEffectiveBytes(stamp.depth, false, RedundancyLevel.OFF)
  const availableSizes = getAvailableSizes(stamp.depth)

  useEffect(() => {
    if (selectedNewSizeBytes === null) {
      setDiluteCostBzz(null)

      return
    }

    let cancelled = false

    bee
      .getSizeExtensionCost(stamp.batchID, Size.fromBytes(selectedNewSizeBytes), undefined, false, RedundancyLevel.OFF)
      .then(cost => {
        if (!cancelled) setDiluteCostBzz(cost)
      })
      .catch(() => {
        if (!cancelled) setDiluteCostBzz(null)
      })

    return () => {
      cancelled = true
    }
  }, [selectedNewSizeBytes, bee, stamp.batchID])

  const bzzBalance = walletBalance?.bzzBalance
  const topupInsufficient = isBalanceInsufficient(topupCostBzz, bzzBalance)
  const diluteInsufficient = isBalanceInsufficient(diluteCostBzz, bzzBalance)
  const topupCostDisplay = formatCost(topupCostBzz, topupInsufficient)
  const diluteCostDisplay = formatCost(diluteCostBzz, diluteInsufficient)

  const handleClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true)
    e.stopPropagation()
  }

  const handleClose = () => {
    setOpen(false)
    setDaysInput('1')
    setSelectedNewSizeBytes(null)
  }

  const handleAction = async () => {
    if (status !== CheckState.OK) {
      enqueueSnackbar(`Node connection status is not ${CheckState.OK}: ${status}`, { variant: 'error' })

      return
    }

    setIsSubmitting(true)

    try {
      if (type === StampExtensionType.Topup) {
        if (!topupValid) {
          enqueueSnackbar('Please enter a valid number of days', { variant: 'error' })

          return
        }

        await bee.extendStorageDuration(stamp.batchID, Duration.fromDays(parsedDays))
        enqueueSnackbar('Lifetime extended successfully. Your changes will appear soon.', { variant: 'success' })
      }

      if (type === StampExtensionType.Dilute) {
        if (selectedNewSizeBytes === null) return

        await bee.extendStorageSize(
          stamp.batchID,
          Size.fromBytes(selectedNewSizeBytes),
          undefined,
          false,
          RedundancyLevel.OFF,
        )
        enqueueSnackbar('Capacity increased successfully. Your changes will appear soon.', { variant: 'success' })
      }
    } catch (error) {
      enqueueSnackbar(`Failed: ${error || 'Unknown reason'}`, { variant: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const buttonLabel = type === StampExtensionType.Topup ? 'Extend Lifetime' : 'Increase Capacity'

  return (
    <Box mb={2}>
      <Button className={classes.buttonSelected} variant="contained" onClick={handleClickOpen} startIcon={icon}>
        {buttonLabel}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth={false}
        slotProps={{ paper: { style: { width: 400, minHeight: 320 } } }}
      >
        <DialogTitle id="form-dialog-title">{buttonLabel}</DialogTitle>
        <DialogContent>
          {type === StampExtensionType.Topup ? (
            <Box>
              <Box className={classes.infoRow}>
                <Typography variant="body2" color="textSecondary">
                  Current lifetime
                </Typography>
                <Typography variant="body2">{preciseTimeString(stamp.duration.toSeconds())}</Typography>
              </Box>
              <Box className={classes.infoRow} alignItems="center" mt={1}>
                <Typography variant="body2" color="textSecondary">
                  Days to add
                </Typography>
                <Input
                  autoFocus
                  type="number"
                  value={daysInput}
                  onChange={e => {
                    const v = parseInt(e.target.value, 10)

                    if (!isNaN(v) && v >= 1) setDaysInput(String(v))
                  }}
                  inputProps={{ min: 1 }}
                  style={{ width: 60 }}
                  sx={{
                    '& input[type=number]': { direction: 'rtl' },
                    '& input[type=number]::-webkit-inner-spin-button': { opacity: 1 },
                    '& input[type=number]::-webkit-outer-spin-button': { opacity: 1 },
                  }}
                />
              </Box>
              <Divider style={{ margin: '16px 0' }} />
              <Box>
                <Box className={classes.infoRow}>
                  <Typography variant="body2" color="textSecondary">
                    New lifetime
                  </Typography>
                  <Typography variant="body2">
                    {newTtlAfterTopup !== null ? preciseTimeString(newTtlAfterTopup) : '-'}
                  </Typography>
                </Box>
                <Box className={classes.infoRow}>
                  <Typography variant="body2" color="textSecondary">
                    Cost
                  </Typography>
                  <Typography variant="body2" color={topupInsufficient ? 'error' : 'inherit'}>
                    {topupCostDisplay}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box className={classes.infoRow}>
                <Typography variant="body2" color="textSecondary">
                  Current capacity
                </Typography>
                <Typography variant="body2">{getHumanReadableFileSize(currentCapacityBytes)}</Typography>
              </Box>
              <Box className={classes.infoRow} alignItems="center" mt={1}>
                <Typography variant="body2" color="textSecondary">
                  Select new capacity
                </Typography>
                <Select
                  size="small"
                  displayEmpty
                  value={selectedNewSizeBytes ?? ''}
                  onChange={e => setSelectedNewSizeBytes((e.target.value as number) || null)}
                  style={{ minWidth: 140 }}
                >
                  <MenuItem value="" disabled>
                    Select capacity
                  </MenuItem>
                  {availableSizes.map(size => (
                    <MenuItem key={size} value={size}>
                      {getHumanReadableFileSize(
                        getProjectedActualBytes(size, currentEffectiveBytes, currentCapacityBytes) -
                          currentCapacityBytes,
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Divider style={{ margin: '16px 0' }} />
              <Box>
                <Box className={classes.infoRow}>
                  <Typography variant="body2" color="textSecondary">
                    New capacity
                  </Typography>
                  <Typography variant="body2">
                    {selectedNewSizeBytes !== null
                      ? getHumanReadableFileSize(
                          getProjectedActualBytes(selectedNewSizeBytes, currentEffectiveBytes, currentCapacityBytes),
                        )
                      : '-'}
                  </Typography>
                </Box>
                <Box className={classes.infoRow}>
                  <Typography variant="body2" color="textSecondary">
                    Cost
                  </Typography>
                  <Typography variant="body2" color={diluteInsufficient ? 'error' : 'inherit'}>
                    {diluteCostDisplay}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            disabled={
              isSubmitting ||
              (type === StampExtensionType.Topup
                ? !topupValid || topupInsufficient
                : selectedNewSizeBytes === null || diluteInsufficient)
            }
            onClick={async () => {
              await handleAction()
              handleClose()
            }}
            color="primary"
          >
            {isSubmitting ? (
              <Box display="flex" alignItems="center" gap={1}>
                Processing…
                <CircularProgress size={14} color="inherit" />
              </Box>
            ) : (
              buttonLabel
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
