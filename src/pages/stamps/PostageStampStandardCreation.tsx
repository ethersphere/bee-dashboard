import { PostageBatchOptions, Utils } from '@ethersphere/bee-js'
import { Box, Button, Grid, Slider, Typography } from '@material-ui/core'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import Check from 'remixicon-react/CheckLineIcon'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampsContext } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { calculateStampPrice, convertAmountToSeconds, secondsToTimeString, waitUntilStampExists } from '../../utils'

interface Props {
  onFinished: () => void
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  }),
)

const marks = [
  { value: 1, label: '1 day' },
  { value: 365, label: '365 days' },
]

export function PostageStampStandardCreation({ onFinished }: Props): ReactElement {
  const classes = useStyles()
  const { refresh } = useContext(StampsContext)
  const { beeDebugApi } = useContext(SettingsContext)

  const [depthInput, setDepthInput] = useState<number>(Utils.getDepthForCapacity(4))
  const [amountInput, setAmountInput] = useState<string>(Utils.getAmountForTtl(30))
  const [labelInput, setLabelInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [buttonValue, setButtonValue] = useState(4)

  function sliderValueChange(_: unknown, newValue: number | number[]) {
    if (typeof newValue !== 'number') {
      return
    }
    const amountValue = Utils.getAmountForTtl(newValue)
    setAmountInput(amountValue)
  }

  const { enqueueSnackbar } = useSnackbar()

  function getTtl(amount: string): string {
    const pricePerBlock = 24000

    return `${secondsToTimeString(
      convertAmountToSeconds(parseInt(amount, 10), pricePerBlock),
    )} (with price of ${pricePerBlock.toFixed(0)} per block)`
  }

  function getPrice(depth: number, amount: bigint): string {
    const price = calculateStampPrice(depth, amount)

    return `${price.toSignificantDigits()} xBZZ`
  }

  async function submit() {
    try {
      // This is really just a typeguard, the validation pretty much guarantees these will have the right values
      if (!depthInput || !amountInput) {
        return
      }

      if (!beeDebugApi) {
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

      const batchId = await beeDebugApi.createPostageBatch(amount.toString(), depth, options)
      await waitUntilStampExists(batchId, beeDebugApi)
      await refresh()
      onFinished()
    } catch (e) {
      console.error(e) // eslint-disable-line
      enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
    }
    setSubmitting(false)
  }

  function handleBatchSize(gigabytes: number) {
    setButtonValue(gigabytes)
    const capacity = Utils.getDepthForCapacity(gigabytes)
    setDepthInput(capacity)
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
        <Grid container justifyContent="space-between" spacing={2}>
          <Grid item xs={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleBatchSize(4)}
              className={buttonValue === 4 ? classes.buttonSelected : ''}
            >
              4 GB
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleBatchSize(32)}
              className={buttonValue === 32 ? classes.buttonSelected : ''}
            >
              32 GB
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => handleBatchSize(256)}
              className={buttonValue === 256 ? classes.buttonSelected : ''}
            >
              256 GB
            </Button>
          </Grid>
        </Grid>
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
            Current price of 24000 per block
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
        <Grid item>
          <SwarmButton
            disabled={submitting || !depthInput || !amountInput}
            onClick={submit}
            iconType={Check}
            loading={submitting}
          >
            Buy New Stamp
          </SwarmButton>
        </Grid>
        <Grid item>
          <Link to={ROUTES.ACCOUNT_STAMPS_NEW_ADVANCED} className={classes.link}>
            Advanced mode
          </Link>
        </Grid>
      </Grid>
    </>
  )
}
