import { Box, Grid, IconButton, Typography, createStyles, makeStyles } from '@material-ui/core'
import { PostageBatchOptions, Utils } from '@upcoming/bee-js'
import BigNumber from 'bignumber.js'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import Check from 'remixicon-react/CheckLineIcon'
import Info from 'remixicon-react/InformationLineIcon'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmSelect } from '../../components/SwarmSelect'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampsContext } from '../../providers/Stamps'
import { ROUTES } from '../../routes'
import { convertAmountToSeconds, secondsToTimeString, waitUntilStampExists } from '../../utils'
import { getHumanReadableFileSize } from '../../utils/file'

interface Props {
  onFinished: () => void
}

const useStyles = makeStyles(() =>
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
    stampVolumeWrapper: {
      width: 'fit-content',
      '& button': {
        marginLeft: 4,
        width: 24,
        padding: 2,
      },
    },
  }),
)

export function PostageStampAdvancedCreation({ onFinished }: Props): ReactElement {
  const classes = useStyles()
  const { chainState } = useContext(BeeContext)
  const { refresh } = useContext(StampsContext)
  const { beeApi } = useContext(SettingsContext)

  const [depthInput, setDepthInput] = useState<string>('')
  const [amountInput, setAmountInput] = useState<string>('')
  const [labelInput, setLabelInput] = useState('')
  const [immutable, setImmutable] = useState(false)
  const [depthError, setDepthError] = useState<string>('')
  const [amountError, setAmountError] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  const { enqueueSnackbar } = useSnackbar()

  function getTtl(amount: bigint): string {
    const isCurrentPriceAvailable = chainState && chainState.currentPrice

    if (amount <= 0 || !isCurrentPriceAvailable) {
      return '-'
    }

    const pricePerBlock = BigInt(chainState.currentPrice)

    return `${secondsToTimeString(
      convertAmountToSeconds(amount, pricePerBlock),
    )} (with price of ${pricePerBlock} PLUR per block)`
  }

  function getPrice(depth: number, amount: bigint): string {
    const hasInvalidInput = amount <= 0 || isNaN(depth) || depth < 17 || depth > 255

    if (hasInvalidInput) {
      return '-'
    }

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
      const depth = Number.parseInt(depthInput)
      const options: PostageBatchOptions = {
        waitForUsable: false,
        label: labelInput || undefined,
        immutableFlag: immutable,
      }

      const batchId = await beeApi.createPostageBatch(amount.toString(), depth, options)
      await waitUntilStampExists(batchId, beeApi)
      await refresh()
      onFinished()
    } catch (e) {
      console.error(e) // eslint-disable-line
      enqueueSnackbar(`Error: ${(e as Error).message}`, { variant: 'error' })
    }
    setSubmitting(false)
  }

  function validateAmountInput(amountInput: string) {
    let validAmountInput = '0'

    if (!amountInput) {
      setAmountError('Required field')
    } else {
      if (amountInput.indexOf('.') > -1) {
        setAmountError('Amount must be an integer')
      } else {
        const amount = new BigNumber(amountInput)

        if (amount.isNaN()) {
          setAmountError('Amount must contain only digits')
        } else if (amount.isLessThanOrEqualTo(0)) {
          setAmountError('Amount must be greater than 0')
        } else {
          setAmountError('')
          validAmountInput = amountInput
        }
      }
    }

    setAmountInput(validAmountInput)
  }

  function validateDepthInput(depthInput: string) {
    let validDepthInput = '0'

    if (!depthInput) {
      setDepthError('Required field')
    } else {
      const depth = new BigNumber(depthInput)

      if (!depth.isInteger()) {
        setDepthError('Depth must be an integer')
      } else if (depth.isLessThan(17)) {
        setDepthError('Minimal depth is 17')
      } else if (depth.isGreaterThan(255)) {
        setDepthError('Depth has to be at most 255')
      } else {
        setDepthError('')
        validDepthInput = depthInput
      }
    }

    setDepthInput(validDepthInput)
  }

  function renderStampVolumesInfo() {
    const depth = parseInt(depthInput, 10)

    if (depthError || isNaN(depth) || depth < 17 || depth > 255) {
      return '-'
    }

    const theoreticalMaximumVolume = getHumanReadableFileSize(Utils.getStampMaximumCapacityBytes(depth))
    const effectiveVolume = getHumanReadableFileSize(Utils.getStampEffectiveBytes(depth))

    return (
      <Grid item container alignItems="center" className={classes.stampVolumeWrapper}>
        <Typography>
          Theoretical: ~{theoreticalMaximumVolume} / Effective: ~{effectiveVolume}
        </Typography>
        <IconButton
          onClick={() =>
            window.open(
              'https://docs.ethswarm.org/docs/learn/technology/contracts/postage-stamp/#effective-utilisation-table',
              '_blank',
              'noopener,noreferrer',
            )
          }
        >
          <Info />
        </IconButton>
      </Grid>
    )
  }

  return (
    <>
      <Box mb={4}>
        <Typography>
          To upload data to Swarm network, you will need to purchase a postage stamp. If you&apos;re not familiar with
          this, please read{' '}
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
      <Box mb={2}>
        <SwarmTextInput name="depth" label="Depth" onChange={event => validateDepthInput(event.target.value)} />
        <Box mt={0.25} sx={{ bgcolor: '#f6f6f6' }} p={2}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Typography>Corresponding file size</Typography>
            {renderStampVolumesInfo()}
          </Grid>
        </Box>
        {depthError && <Typography>{depthError}</Typography>}
      </Box>
      <Box mb={2}>
        <SwarmTextInput name="amount" label="Amount" onChange={event => validateAmountInput(event.target.value)} />
        <Box mt={0.25} sx={{ bgcolor: '#f6f6f6' }} p={2}>
          <Grid container justifyContent="space-between">
            <Typography>Corresponding TTL (Time to live)</Typography>
            <Typography>{!amountError && amountInput ? getTtl(BigInt(amountInput)) : '-'}</Typography>
          </Grid>
        </Box>
        {amountError && <Typography>{amountError}</Typography>}
      </Box>
      <Box mb={2}>
        <SwarmTextInput name="label" label="Label" optional onChange={event => setLabelInput(event.target.value)} />
      </Box>
      <Box mb={2}>
        <SwarmSelect
          label="Immutable"
          defaultValue="No"
          onChange={event => setImmutable(event.target.value === 'Yes')}
          options={[
            { value: 'Yes', label: 'Yes' },
            { value: 'No', label: 'No' },
          ]}
        />
        <Box mt={0.25} sx={{ bgcolor: '#f6f6f6' }} p={2}>
          <Grid container justifyContent="space-between">
            {immutable && (
              <Typography>
                Once an immutable stamp is maxed out, it disallows further content uploads, thereby safeguarding your
                previously uploaded content from unintentional overwriting.
              </Typography>
            )}
            {!immutable && (
              <Typography>
                When a mutable stamp reaches full capacity, it still permits new content uploads. However, this comes
                with the caveat of overwriting previously uploaded content associated with the same stamp.
              </Typography>
            )}
          </Grid>
        </Box>
      </Box>
      <Box mb={4} sx={{ bgcolor: '#fcf2e8' }} p={2}>
        <Grid container justifyContent="space-between">
          <Typography>Indicative Price</Typography>
          <Typography>
            {!amountError && !depthError && amountInput && depthInput
              ? getPrice(parseInt(depthInput, 10), BigInt(amountInput))
              : '-'}
          </Typography>
        </Grid>
      </Box>

      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <SwarmButton
            disabled={submitting || Boolean(depthError) || Boolean(amountError) || !depthInput || !amountInput}
            onClick={submit}
            iconType={Check}
            loading={submitting}
          >
            Buy New Stamp
          </SwarmButton>
        </Grid>
        <Grid item>
          <Link to={ROUTES.ACCOUNT_STAMPS_NEW_STANDARD} className={classes.link}>
            Standard mode
          </Link>
        </Grid>
      </Grid>
    </>
  )
}
