import { PostageBatchOptions } from '@ethersphere/bee-js'
import { Box, Grid, Typography } from '@material-ui/core'
import BigNumber from 'bignumber.js'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useEffect, useState } from 'react'
import Check from 'remixicon-react/CheckLineIcon'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmSelect } from '../../components/SwarmSelect'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { Context as StampsContext } from '../../providers/Stamps'
import {
  calculateStampPrice,
  convertAmountToSeconds,
  convertDepthToBytes,
  secondsToTimeString,
  waitUntilStampExists,
} from '../../utils'
import { getHumanReadableFileSize } from '../../utils/file'

interface Props {
  onFinished: () => void
}

export function PostageStampCreation({ onFinished }: Props): ReactElement {
  const { chainState } = useContext(BeeContext)
  const { refresh } = useContext(StampsContext)
  const { beeDebugApi } = useContext(SettingsContext)

  const [depthInput, setDepthInput] = useState<string>('')
  const [amountInput, setAmountInput] = useState<string>('')
  const [labelInput, setLabelInput] = useState('')
  const [immutable, setImmutable] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const { enqueueSnackbar } = useSnackbar()

  function getFileSize(depth: number): string {
    if (isNaN(depth) || depth < 17 || depth > 255) {
      return '-'
    }

    return `~${getHumanReadableFileSize(convertDepthToBytes(depth))}`
  }

  function getTtl(amount: number): string {
    const isCurrentPriceAvailable = chainState && chainState.currentPrice

    if (amount <= 0 || !isCurrentPriceAvailable) {
      return '-'
    }

    const pricePerBlock = Number.parseInt(chainState.currentPrice, 10)

    return `${secondsToTimeString(
      convertAmountToSeconds(amount, pricePerBlock),
    )} (with price of ${pricePerBlock.toFixed(0)} per block)`
  }

  function getPrice(depth: number, amount: bigint): string {
    const hasInvalidInput = amount <= 0 || isNaN(depth) || depth < 17 || depth > 255

    if (hasInvalidInput) {
      return '-'
    }

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
      const depth = Number.parseInt(depthInput)
      const options: PostageBatchOptions = {
        waitForUsable: false,
        label: labelInput || undefined,
        immutableFlag: immutable,
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

  useEffect(() => {
    function validate() {
      const errors: Record<string, string> = {}

      if (!depthInput) {
        errors.depth = 'Required field'
      } else {
        const depth = new BigNumber(depthInput)

        if (!depth.isInteger()) {
          errors.depth = 'Depth must be an integer'
        } else if (depth.isLessThan(17)) {
          errors.depth = 'Minimal depth is 17'
        } else if (depth.isGreaterThan(255)) {
          errors.depth = 'Depth has to be at most 255'
        }
      }

      if (!amountInput) {
        errors.amount = 'Required field'
      } else {
        const amount = new BigNumber(amountInput)

        if (!amount.isInteger()) {
          errors.amount = 'Amount must be an integer'
        } else if (amount.isLessThanOrEqualTo(0)) {
          errors.amount = 'Amount must be greater than 0'
        }
      }

      return errors
    }

    setErrors(validate())
  }, [depthInput, amountInput])

  function checkAndSetAmountInput(value: string) {
    const amount = new BigNumber(value)
    const onlyDigits = amount.isNaN() ? '0' : value
    setAmountInput(onlyDigits)
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
        <SwarmTextInput name="depth" label="Depth" onChange={event => setDepthInput(event.target.value)} />
        <Box mt={0.25} sx={{ bgcolor: '#f6f6f6' }} p={2}>
          <Grid container justifyContent="space-between">
            <Typography>Corresponding file size</Typography>
            <Typography>{!errors.depth && depthInput ? getFileSize(parseInt(depthInput, 10)) : '-'}</Typography>
          </Grid>
        </Box>
      </Box>
      <Box mb={2}>
        <SwarmTextInput name="amount" label="Amount" onChange={event => checkAndSetAmountInput(event.target.value)} />
        <Box mt={0.25} sx={{ bgcolor: '#f6f6f6' }} p={2}>
          <Grid container justifyContent="space-between">
            <Typography>Corresponding TTL (Time to live)</Typography>
            <Typography>{!errors.amount && amountInput ? getTtl(Number.parseInt(amountInput, 10)) : '-'}</Typography>
          </Grid>
        </Box>
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
            {!errors.amount && !errors.depth && amountInput && depthInput
              ? getPrice(parseInt(depthInput, 10), BigInt(amountInput))
              : '-'}
          </Typography>
        </Grid>
      </Box>
      <SwarmButton
        disabled={submitting || Object.keys(errors).length > 0}
        onClick={submit}
        iconType={Check}
        loading={submitting}
      >
        Buy New Stamp
      </SwarmButton>
    </>
  )
}
