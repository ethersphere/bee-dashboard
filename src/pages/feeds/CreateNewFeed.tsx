import { Box, Grid, Typography, Checkbox } from '@material-ui/core'
import { Form, Formik } from 'formik'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import Check from 'remixicon-react/CheckLineIcon'
import X from 'remixicon-react/CloseLineIcon'
import { useNavigate } from 'react-router'
import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmSelect } from '../../components/SwarmSelect'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { Context as FeedsContext, Identity, IdentityType } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { convertWalletToIdentity, generateWallet, persistIdentity, getWalletFromIdentity } from '../../utils/identity'
import { Wallet } from 'ethers'
import * as React from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'

interface FormValues {
  identityName?: string
  type?: IdentityType
  website: boolean
  topic: string
  password?: string
}

const initialValues: FormValues = {
  identityName: '',
  type: 'V3',
  password: '',
  website: false,
  topic: '00',
}

export default function CreateNewFeed(): ReactElement {
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const { identities, setIdentities, optionsArray } = useContext(FeedsContext)
  const [loading, setLoading] = useState(false)
  const [website, setFeedType] = useState(true)
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()
  const [checked, setChecked] = React.useState(true)
  const [checkedpk, setCheckedk] = React.useState(true)

  const handleChangeNewId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked)
  }

  const handleChangeV3oPk = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckedk(event.target.checked)
  }

  async function onSubmit(values: FormValues) {
    setLoading(true)

    if (!beeApi) {
      enqueueSnackbar(<span>Bee API unavailabe</span>, { variant: 'error' })
      setLoading(false)

      return
    }
    let wallet: Wallet

    if (values.identityName === 'New') {
      wallet = generateWallet()
    } else {
      const identity = identities.find(x => x.name === values.identityName)
      {
        identity ? (wallet = await getWalletFromIdentity(identity, values.password)) : (wallet = generateWallet())
      }
    }

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

    const identity = await convertWalletToIdentity(
      wallet,
      values.type,
      values.identityName,
      values.topic,
      values.password,
    )
    persistIdentity(identities, identity)
    setIdentities(identities)
    navigate(ROUTES.ACCOUNT_FEEDS)
    setLoading(false)
    enqueueSnackbar(<span>Done saving new ID</span>, { variant: 'error' })
  }

  function cancel() {
    navigate(-1)
  }

  function setTopic() {
    setFeedType(false)
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
              {checked ? (
                <SwarmTextInput name="identityName" label="Identity name" formik />
              ) : (
                <SwarmSelect formik name="identityName" label="Identity name" options={optionsArray} />
              )}
            </Box>
            <SwarmSelect
              formik
              name="Type"
              options={[
                { label: 'V3', value: 'V3' },
                { label: 'PRIVATE_KEY', value: 'PRIVATE_KEY' },
              ]}
            />
            {values.type === 'V3' && <SwarmTextInput name="password" label="Password" password formik />}
            <Box mt={2}>
              {website ? (
                <ExpandableListItemKey label="topic" value={'00'.repeat(32)} />
              ) : (
                <SwarmTextInput name="topic" label="Specify Feed Topic" formik />
              )}
            </Box>
            <Box mt={2} sx={{ bgcolor: '#fcf2e8' }} p={2}>
              <Grid container justifyContent="space-between">
                <Typography>Feeds name</Typography>
                <Typography>{values.identityName}</Typography>
              </Grid>
            </Box>
            <Box mt={1.25}>
              <ExpandableListItemActions>
                <SwarmButton onClick={submitForm} iconType={Check} disabled={loading} loading={loading}>
                  Create Feed
                </SwarmButton>
                <SwarmButton onClick={setTopic} iconType={Check} disabled={loading} loading={loading}>
                  Feed
                </SwarmButton>
                <SwarmButton onClick={cancel} iconType={X} disabled={loading} cancel>
                  Cancel
                </SwarmButton>
                <FormControlLabel
                  label="Create a new ID"
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeNewId}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                />
                <FormControlLabel
                  label="V3 or Privatk"
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChangeV3oPk}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  }
                />
              </ExpandableListItemActions>
            </Box>
          </Form>
        )}
      </Formik>
    </div>
  )
}
