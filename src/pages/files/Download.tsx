import { Utils } from '@ethersphere/bee-js'
import { ManifestJs } from '@ethersphere/manifest-js'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import ExpandableListItemInput from '../../components/ExpandableListItemInput'
import { History } from '../../components/History'
import { Context, defaultUploadOrigin } from '../../providers/File'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { extractSwarmHash } from '../../utils'
import { determineHistoryName, HISTORY_KEYS, putHistory } from '../../utils/local-storage'
import { FileNavigation } from './FileNavigation'

export function Download(): ReactElement {
  const [loading, setLoading] = useState(false)
  const { beeApi } = useContext(SettingsContext)
  const [referenceError, setReferenceError] = useState<string | undefined>(undefined)

  const { setUploadOrigin } = useContext(Context)

  const { enqueueSnackbar } = useSnackbar()
  const history = useHistory()

  const validateChange = (value: string) => {
    if (Utils.isHexString(value, 64) || Utils.isHexString(value, 128) || !value.trim().length) {
      setReferenceError(undefined)
    } else {
      setReferenceError('Incorrect format of swarm hash. Expected 64 or 128 hexstring characters.')
    }
  }

  async function onSwarmIdentifier(identifier: string) {
    if (!beeApi) {
      return
    }

    try {
      const manifestJs = new ManifestJs(beeApi)
      const isManifest = await manifestJs.isManifest(identifier)

      if (!isManifest) {
        throw Error('The specified hash does not contain valid content.')
      }
      const indexDocument = await manifestJs.getIndexDocumentPath(identifier)
      putHistory(HISTORY_KEYS.DOWNLOAD_HISTORY, identifier, determineHistoryName(identifier, indexDocument))
      setUploadOrigin(defaultUploadOrigin)
      history.push(ROUTES.HASH.replace(':hash', identifier))
    } catch (error: unknown) {
      let message = typeof error === 'object' && error !== null && Reflect.get(error, 'message')

      if (message.includes('path address not found')) {
        message = 'The specified hash does not have an index document set.'
      }

      if (message.includes('Not Found: Not Found')) {
        message = 'The specified hash was not found.'
      }
      enqueueSnackbar(<span>Error: {message || 'Unknown'}</span>, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  function recognizeSwarmHash(value: string) {
    if (value.length < 64) {
      return value
    }

    const hash = extractSwarmHash(value)

    if (hash) {
      return hash
    }

    return value
  }

  return (
    <>
      <FileNavigation active="DOWNLOAD" />
      <ExpandableListItemInput
        label="Swarm Hash"
        onConfirm={value => onSwarmIdentifier(value)}
        onChange={validateChange}
        helperText={referenceError}
        confirmLabel={'Search'}
        confirmLabelDisabled={Boolean(referenceError) || loading}
        placeholder="e.g. 31fb0362b1a42536134c86bc58b97ac0244e5c6630beec3e27c2d1cecb38c605"
        expandedOnly
        mapperFn={value => recognizeSwarmHash(value)}
      />
      <History title="Download History" localStorageKey={HISTORY_KEYS.DOWNLOAD_HISTORY} />
    </>
  )
}
