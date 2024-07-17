import { BeeModes, Utils } from '@ethersphere/bee-js'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Search from 'remixicon-react/SearchLineIcon'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { History } from '../../components/History'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as FileContext, defaultUploadOrigin } from '../../providers/File'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { recognizeEnsOrSwarmHash, regexpEns } from '../../utils'
import { HISTORY_KEYS, determineHistoryName, putHistory } from '../../utils/local-storage'
import { ManifestJs } from '../../utils/manifest'
import { FileNavigation } from './FileNavigation'

export function Download(): ReactElement {
  const [loading, setLoading] = useState(false)
  const { beeApi } = useContext(SettingsContext)
  const [referenceError, setReferenceError] = useState<string | undefined>(undefined)
  const { nodeInfo } = useContext(BeeContext)

  const { setUploadOrigin } = useContext(FileContext)

  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const validateChange = (value: string) => {
    if (
      Utils.isHexString(value, 64) ||
      Utils.isHexString(value, 128) ||
      !value.trim().length ||
      regexpEns.test(value)
    ) {
      setReferenceError(undefined)
    } else {
      setReferenceError('Incorrect format of swarm hash. Expected 64 or 128 hexstring characters or ENS domain.')
    }
  }

  async function onSwarmIdentifier(identifier: string) {
    setLoading(true)

    if (!beeApi) {
      setLoading(false)

      return
    }

    try {
      const manifestJs = new ManifestJs(beeApi)
      const feedIdentifier = await manifestJs.resolveFeedManifest(identifier)

      if (feedIdentifier) {
        identifier = feedIdentifier
      }
      const isManifest = await manifestJs.isManifest(identifier)

      if (!isManifest) {
        throw Error('The specified hash does not contain valid content.')
      }
      const indexDocument = await manifestJs.getIndexDocumentPath(identifier)
      putHistory(HISTORY_KEYS.DOWNLOAD_HISTORY, identifier, determineHistoryName(identifier, indexDocument))
      setUploadOrigin(defaultUploadOrigin)
      navigate(ROUTES.HASH.replace(':hash', identifier))
    } catch (error: unknown) {
      let message = typeof error === 'object' && error !== null && Reflect.get(error, 'message')

      if (message.includes('path address not found')) {
        message = 'The specified hash does not have an index document set.'
      }

      if (message.includes('Not Found: Not Found')) {
        message = 'The specified hash was not found.'
      }
      console.error(error) // eslint-disable-line
      enqueueSnackbar(<span>Error: {message || 'Unknown'}</span>, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {nodeInfo?.beeMode !== BeeModes.ULTRA_LIGHT && <FileNavigation active="DOWNLOAD" />}
      <ExpandableListItemInput
        label="Swarm Hash or ENS"
        onConfirm={value => onSwarmIdentifier(value)}
        onChange={validateChange}
        helperText={referenceError}
        confirmLabel={'Find'}
        confirmLabelDisabled={Boolean(referenceError) || loading}
        confirmIcon={Search}
        placeholder="e.g. 31fb0362b1a42536134c86bc58b97ac0244e5c6630beec3e27c2d1cecb38c605"
        expandedOnly
        mapperFn={value => recognizeEnsOrSwarmHash(value)}
        loading={loading}
      />
      <History title="Download History" localStorageKey={HISTORY_KEYS.DOWNLOAD_HISTORY} />
    </>
  )
}
