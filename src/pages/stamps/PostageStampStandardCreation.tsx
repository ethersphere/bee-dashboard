import { Duration, PostageBatchOptions, Size, Utils } from '@ethersphere/bee-js'
import { Box, Button, Grid, Slider, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import Check from 'remixicon-react/CheckLineIcon'
import { makeStyles } from 'tss-react/mui'

import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampsContext } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { secondsToTimeString } from '../../utils'
import { validateDepthInput } from '../../utils/stamp'

interface Props {
  onFinished: () => void
}
const useStyles = makeStyles()(theme => ({
  link: {
    color: '#dd7700',
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'none',

      // https://github.com/mui-org/material-ui/issues/22543
      '@media (hover: none)': {
        textDecoration: 'none',
      },
    },
  },
  buttonSelected: {
    color: 'white',
    backgroundColor: theme.palette.primary.main,
  },
  buttonUnselected: {
    color: theme.palette.secondary.main,
    backgroundColor: 'white',
  },
}))

const marks = [
  { value: 1, label: '1 day' },
  { value: 365, label: '365 days' },
]

export function PostageStampStandardCreation({ onFinished }: Props): ReactElement {
  const { classes } = useStyles()
  const { refresh } = useContext(StampsContext)
  const { beeApi } = useContext(SettingsContext)

  const [depthInput, setDepthInput] = useState<number>(Utils.getDepthForSize(Size.fromGigabytes(4)))
  const [amountInput, setAmountInput] = useState<bigint>(Utils.getAmountForDuration(Duration.fromDays(30), 26500, 5))
  const [labelInput, setLabelInput] = useState<string>('')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [buttonValue, setButtonValue] = useState<number>(4)
  const [depthError, setDepthError] = useState<string>('')

  const getBatchValue = (value: number) => {
    return (
      <Box sx={{ flex: 1 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={() => handleBatchSize(value)}
          className={buttonValue === value ? classes.buttonSelected : classes.buttonUnselected}
        >
          {value} GB
        </Button>
      </Box>
    )
  }

  function sliderValueChange(_: unknown, newValue: number | number[]) {
    if (typeof newValue !== 'number') {
      return
    }
    const amountValue = Utils.getAmountForDuration(Duration.fromDays(newValue), 26500, 5)
    setAmountInput(amountValue)
  }

  const { enqueueSnackbar } = useSnackbar()

  function getTtl(amount: bigint): string {
    const pricePerBlock = 24000

    return `${secondsToTimeString(
      Utils.getStampDuration(amount, pricePerBlock, 5).toSeconds(),
    )} (with price of ${pricePerBlock} PLUR per block)`
  }

  function getPrice(depth: number, amount: bigint): string {
    const price = Utils.getStampCost(depth, amount)

    return `${price.toSignificantDigits(4)} xBZZ`
  }

  async function submit() {
    try {
      // This is really just a typeguard, the validation pretty much guarantees these will have the right values
      if (!depthInput || !amountInput) {
        return
      }

      if (!beeApi) {
        return
      }

      setSubmitting(true)
      const amount = BigInt(amountInput)
      const depth = depthInput
      const options: PostageBatchOptions = {
        waitForUsable: false,
        label: labelInput || undefined,
        immutableFlag: true,
      }

      await beeApi.createPostageBatch(amount.toString(), depth, options)
      await refresh()
      onFinished()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
    }
    setSubmitting(false)
  }

  function handleBatchSize(gigabytes: number) {
    const capacity = Utils.getDepthForSize(Size.fromGigabytes(gigabytes))
    validateDepthInput(String(capacity), setDepthError, (v: string) => setDepthInput(Number(v)))
    setButtonValue(gigabytes)
  }

  return (
    <>
      <Box mb={4}>
        <Typography>
          A postage stamp batch containes postage stamps that will give you the right to upload data to the Swarm
          network. If you&apos;re not familiar with this, please read&nbsp;
          <a
            href="https://medium.com/ethereum-swarm/how-to-upload-data-to-the-swarm-network-c0766c3ae381"
            target="_blank"
            rel="noreferrer"
          >
            this guide
          </a>
          .
        </Typography>
      </Box>
      <Box mb={1}>
        <Typography variant="h2">Batch name</Typography>
      </Box>
      <Box mb={2}>
        <SwarmTextInput name="depth" label="Label" onChange={e => setLabelInput(e.target.value)} />
      </Box>
      <Box mb={1}>
        <Typography variant="h2">Batch size</Typography>
      </Box>
      <Box mb={2}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {getBatchValue(4)}
          {getBatchValue(32)}
          {getBatchValue(256)}
        </Box>
        {depthError && <Typography>{depthError}</Typography>}
      </Box>
      <Box mb={1}>
        <Typography variant="h2">Data persistence</Typography>
      </Box>
      <Box mb={2}>
        <Slider
          aria-label="Volume"
          min={1}
          max={365}
          step={1}
          marks={marks}
          valueLabelDisplay="auto"
          defaultValue={30}
          onChange={sliderValueChange}
        />
      </Box>
      <Box mb={2}>
        <Box mt={0.25} sx={{ bgcolor: '#f6f6f6' }} p={2}>
          <Grid container justifyContent="space-between">
            <Typography>Corresponding TTL (Time to live)</Typography>
            <Typography>{amountInput ? getTtl(amountInput) : '-'}</Typography>
          </Grid>
        </Box>
        <Box display="flex" justifyContent={'right'} mt={0.5}>
          <Typography style={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.26)' }}>
            Current price of 24000 PLUR per block
          </Typography>
        </Box>
      </Box>
      <Box mb={4} sx={{ bgcolor: '#fcf2e8' }} p={2}>
        <Grid container justifyContent="space-between">
          <Typography>Indicative Price</Typography>
          <Typography>{getPrice(depthInput, BigInt(amountInput))}</Typography>
        </Grid>
      </Box>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid>
          <SwarmButton
            disabled={submitting || !depthInput || Boolean(depthError) || !amountInput}
            onClick={submit}
            iconType={Check}
            loading={submitting}
          >
            Buy New Stamp
          </SwarmButton>
        </Grid>
        <Grid>
          <Link to={ROUTES.ACCOUNT_STAMPS_NEW_ADVANCED} className={classes.link}>
            Advanced mode
          </Link>
        </Grid>
      </Grid>
    </>
  )
}
