import CircularProgress from '@mui/material/CircularProgress'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext } from 'react'

import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as SettingsContext } from '../../providers/Settings'
import { extractBeeApiErrorMessage } from '../../utils/bee-error'
import { newGnosisProviderForValidation } from '../../utils/chain'
import {
  getDesktopConfiguration,
  restartBeeNode,
  setEnsResolverInDesktop,
  setJsonRpcInDesktop,
} from '../../utils/desktop'

export default function SettingsPage(): ReactElement {
  const {
    apiUrl,
    setApiUrl,
    lockedApiSettings,
    cors,
    dataDir,
    configFile,
    ensResolver,
    rpcProviderUrl,
    isLoading,
    isDesktop,
    desktopUrl,
    setAndPersistJsonRpcProvider,
    setEnsResolver,
  } = useContext(SettingsContext)
  const { refresh } = useContext(BeeContext)
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  async function handleSetRpcUrl(value: string) {
    try {
      await newGnosisProviderForValidation(value).getNetwork()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      enqueueSnackbar(`Failed to connect to RPC endpoint. ${extractBeeApiErrorMessage(e)}`, { variant: 'error' })

      return
    }

    try {
      setAndPersistJsonRpcProvider(value)

      const shouldUpdateDesktop = isDesktop && (await getDesktopConfiguration(desktopUrl))['blockchain-rpc-endpoint']

      if (shouldUpdateDesktop) {
        await setJsonRpcInDesktop(desktopUrl, value)
        const snackKey = enqueueSnackbar('RPC endpoint successfully changed, restarting Bee node...', {
          variant: 'success',
        })
        await restartBeeNode(desktopUrl)
        closeSnackbar(snackKey)
        enqueueSnackbar('Bee node restarted', { variant: 'success' })
      } else {
        enqueueSnackbar('RPC endpoint successfully changed', { variant: 'success' })
      }

      await refresh()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      enqueueSnackbar(`Failed to change RPC endpoint. ${extractBeeApiErrorMessage(e)}`, { variant: 'error' })
    }
  }

  async function handleSetEnsResolverUrl(value: string) {
    try {
      await setEnsResolverInDesktop(desktopUrl, value)
      setEnsResolver(value)

      const snackKey = enqueueSnackbar('ENS resolver successfully changed, restarting Bee node...', {
        variant: 'success',
      })
      await restartBeeNode(desktopUrl)
      closeSnackbar(snackKey)
      enqueueSnackbar('Bee node restarted', { variant: 'success' })

      await refresh()
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      enqueueSnackbar(`Failed to change ENS resolver. ${extractBeeApiErrorMessage(e)}`, { variant: 'error' })
    }
  }

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <ExpandableList label="API Settings" defaultOpen>
        <ExpandableListItemInput
          label="Bee API"
          value={apiUrl}
          onConfirm={setApiUrl}
          locked={lockedApiSettings || isDesktop}
        />
        <ExpandableListItemInput
          label="Blockchain RPC URL"
          value={rpcProviderUrl}
          helperText="Changing the value will restart your bee node."
          confirmLabel="Save and restart"
          onConfirm={handleSetRpcUrl}
        />
      </ExpandableList>
      {isDesktop && (
        <ExpandableList label="Desktop Settings" defaultOpen>
          <ExpandableListItemInput label="CORS" value={cors ?? '-'} locked />
          <ExpandableListItemInput label="Data DIR" value={dataDir ?? '-'} locked />
          <ExpandableListItemInput label="Config file" value={configFile ?? '-'} locked />
          <ExpandableListItemInput
            label="ENS resolver URL"
            value={ensResolver ?? '-'}
            helperText="Changing the value will restart your bee node."
            confirmLabel="Save and restart"
            onConfirm={handleSetEnsResolverUrl}
          />
        </ExpandableList>
      )}
    </>
  )
}
