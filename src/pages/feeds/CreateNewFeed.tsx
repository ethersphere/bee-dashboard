import { NULL_TOPIC, PostageBatch } from '@ethersphere/bee-js'
import { Box, Grid, Typography } from '@mui/material'
import { Wallet } from 'ethers'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import Check from 'remixicon-react/CheckLineIcon'
import X from 'remixicon-react/CloseLineIcon'

import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SelectEvent, SwarmSelect } from '../../components/SwarmSelect'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context as FeedsContext, IdentityType } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { convertWalletToIdentity, generateWallet, persistIdentity } from '../../utils/identity'

interface FormValues {
  identityName?: string
  type?: IdentityType
  password?: string
}

const initialValues: FormValues = {
  identityName: '',
  type: IdentityType.PrivateKey,
  password: '',
}

export default function CreateNewFeed(): ReactElement {
  const { beeApi } = useContext(SettingsContext)
  const { identities, setIdentities } = useContext(FeedsContext)
  const [identityType, setIdentityType] = useState<IdentityType>(IdentityType.PrivateKey)
  const [loading, setLoading] = useState<boolean>(false)
  const { enqueueSnackbar } = useSnackbar()

  const navigate = useNavigate()

  async function onSubmit(values: FormValues) {
    setLoading(true)

    if (!beeApi) {
      enqueueSnackbar(<span>Bee API unavailabe</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    let stamps: PostageBatch[] = []
    let wallet: Wallet

    try {
      wallet = generateWallet()
      stamps = (await beeApi.getPostageBatches()).filter(s => s.usable)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      enqueueSnackbar(<span>Error during wallet generation or postage stamp retrieval!</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    if (!stamps || !stamps.length) {
      enqueueSnackbar(<span>No usable stamp available</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    if (!values.identityName || !values.type) {
      enqueueSnackbar(<span>Form is unfinished</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    try {
      const identity = await convertWalletToIdentity(wallet, values.type, values.identityName, values.password)
      persistIdentity(identities, identity)
      setIdentities(identities)
      navigate(ROUTES.ACCOUNT_FEEDS)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      enqueueSnackbar(<span>Error identity creation!</span>, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  function cancel() {
    navigate(-1)
  }

  function onIdentityTypeChange(event: SelectEvent) {
    const type = event.target.value as IdentityType
    setIdentityType(type)
  }

  return (
    <div>
      <HistoryHeader>Create new feed</HistoryHeader>
      <Box mb={4}>
        <DocumentationText>
          To create a feed you will need to create an identity. Please refer to the{' '}
          <a
            href="https://docs.ethswarm.org/api/#tag/Feed/paths/~1feeds~1{owner}~1{topic}/post"
            target="_blank"
            rel="noreferrer"
          >
            official Bee documentation
          </a>{' '}
          to understand how feeds work.
        </DocumentationText>
      </Box>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ submitForm, values }) => (
          <Form>
            <Box mb={0.25}>
              <SwarmTextInput name="identityName" label="Identity name" formik />
            </Box>
            <Box mb={0.25}>
              <SwarmSelect
                formik
                name="type"
                label={'type'}
                value={identityType}
                options={[
                  { label: 'Keypair Only', value: IdentityType.PrivateKey },
                  { label: 'Password Protected', value: IdentityType.V3 },
                ]}
                onChange={onIdentityTypeChange}
              />
            </Box>
            {values.type === IdentityType.V3 && <SwarmTextInput name="password" label="Password" password formik />}
            <Box mt={2}>
              <ExpandableListItemKey label="Topic" value={NULL_TOPIC.toHex()} />
            </Box>
            <Box mt={2} sx={{ bgcolor: '#fcf2e8' }} p={2}>
              <Grid container justifyContent="space-between">
                <Typography>Feeds name</Typography>
                <Typography>{values.identityName} Website</Typography>
              </Grid>
            </Box>
            <Box mt={1.25}>
              <ExpandableListItemActions>
                <SwarmButton onClick={submitForm} iconType={Check} disabled={loading} loading={loading}>
                  Create Feed
                </SwarmButton>
                <SwarmButton onClick={cancel} iconType={X} disabled={loading} cancel>
                  Cancel
                </SwarmButton>
              </ExpandableListItemActions>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  )
}
