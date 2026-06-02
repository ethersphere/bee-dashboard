import { NULL_TOPIC } from '@ethersphere/bee-js'
import { Box } from '@mui/material'
import { saveAs } from 'file-saver'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import X from 'remixicon-react/CloseLineIcon'
import Download from 'remixicon-react/DownloadLineIcon'

import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as IdentityContext } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { FileOrigin } from '../files/FileNavigation'
import { UploadArea } from '../files/UploadArea'

export function FeedSubpage(): ReactElement {
  const { identities } = useContext(IdentityContext)
  const { uuid } = useParams()
  const { beeApi, apiUrl } = useContext(SettingsContext)
  const { status } = useContext(BeeContext)
  const navigate = useNavigate()

  const [available, setAvailable] = useState(false)
  const [opening, setOpening] = useState(false)

  const identity = identities.find(x => x.uuid === uuid)

  useEffect(() => {
    if (!identity) {
      navigate(ROUTES.ACCOUNT_FEEDS, { replace: true })

      return
    }

    if (identity.feedHash) {
      beeApi
        ?.downloadData(identity.feedHash)
        .then(() => setAvailable(true))
        .catch(() => setAvailable(false))
    }
  }, [beeApi, uuid, identity, navigate])

  if (!identity || !status.all) {
    return <></>
  }

  function onClose() {
    navigate(ROUTES.ACCOUNT_FEEDS)
  }

  async function handleOpen() {
    const feedHash = identity?.feedHash
    const address = identity?.address

    if (!feedHash || !address || !beeApi) return

    setOpening(true)

    try {
      const file = await beeApi.downloadFile(feedHash)

      if (file.contentType?.includes('text/html')) {
        window.open(`${apiUrl}/bzz/${feedHash}/`, '_blank', 'noopener,noreferrer')
      } else {
        const blob = new Blob([file.data.toUint8Array().buffer as ArrayBuffer], {
          type: file.contentType || 'application/octet-stream',
        })
        saveAs(blob, file.name || feedHash)
      }
    } catch {
      const result = await beeApi
        .makeFeedReader(NULL_TOPIC, address)
        .downloadReference()
        .catch(() => null)

      if (result) {
        navigate(ROUTES.HASH.replace(':hash', result.reference.toHex()))
      } else {
        window.open(`${apiUrl}/bzz/${feedHash}/`, '_blank', 'noopener,noreferrer')
      }
    } finally {
      setOpening(false)
    }
  }

  return (
    <div>
      <HistoryHeader>{`${identity.name} Website`}</HistoryHeader>
      <UploadArea showHelp={false} uploadOrigin={{ origin: FileOrigin.Feed, uuid }} />
      {available && identity.feedHash ? (
        <>
          <Box mb={2}>
            <ExpandableListItemKey label="Feed hash" value={identity.feedHash} />
          </Box>
          <Box mb={4}>
            <ExpandableListItemActions>
              <SwarmButton iconType={Download} onClick={handleOpen} loading={opening}>
                Open / Download
              </SwarmButton>
            </ExpandableListItemActions>
          </Box>
        </>
      ) : (
        <Box mb={4}>
          <DocumentationText>
            This feed has no content yet. Use the upload area above to add a file, folder, or website to activate it.
          </DocumentationText>
        </Box>
      )}
      <ExpandableListItemActions>
        <SwarmButton iconType={X} onClick={onClose} cancel>
          Close
        </SwarmButton>
      </ExpandableListItemActions>
    </div>
  )
}
