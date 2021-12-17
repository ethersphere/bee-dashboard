import { Box, Grid, Typography } from '@material-ui/core'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Check, X } from 'react-feather'
import { useHistory } from 'react-router'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmSelect } from '../../components/SwarmSelect'
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
  type: 'PRIVATE_KEY',
  password: '',
}

export default function CreateNewFeed(): ReactElement {
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const { identities, setIdentities } = useContext(FeedsContext)
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  const history = useHistory()

  async function onSubmit(values: FormValues) {
    setLoading(true)

    if (!beeApi) {
      enqueueSnackbar(<span>Bee API unavailabe</span>, { variant: 'error' })
      setLoading(false)

      return
    }
    const wallet = generateWallet()
    const stamps = await beeDebugApi?.getAllPostageBatch()

    if (!stamps || !stamps.length) {
      enqueueSnackbar(<span>No stamp available</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    if (!values.identityName || !values.type) {
      enqueueSnackbar(<span>Form is unfinished</span>, { variant: 'error' })
      setLoading(false)

      return
    }

    const identity = await convertWalletToIdentity(wallet, values.type, values.identityName, values.password)
    persistIdentity(identities, identity)
    setIdentities(identities)
    history.push(ROUTES.FEEDS)
    setLoading(false)
  }

  function cancel() {
    history.goBack()
  }

  return (
    <div>
      <HistoryHeader>Create new feed</HistoryHeader>
      <Box mb={4}>
        <Typography>
          To create a feed you will need to create an identity. Please refer to the official Bee documentation to
          understand how feeds work.
        </Typography>
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
                options={[
                  { label: 'Keypair Only', value: 'PRIVATE_KEY' },
                  { label: 'Password Protected', value: 'V3' },
                ]}
              />
            </Box>
            {values.type === 'V3' && <SwarmTextInput name="password" label="Password" password formik />}
            <Box mt={2}>
              <ExpandableListItemKey label="Topic" value={'00'.repeat(32)} />
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
