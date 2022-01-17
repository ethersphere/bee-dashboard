import * as swarmCid from '@ethersphere/swarm-cid'
import { Box } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { X } from 'react-feather'
import { useParams, useNavigate } from 'react-router-dom'
import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableListItemLink from '../../components/ExpandableListItemLink'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as BeeContext } from '../../providers/Bee'
import { Context as IdentityContext } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { UploadArea } from '../files/UploadArea'

export function FeedSubpage(): ReactElement {
  const { identities } = useContext(IdentityContext)
  const { uuid } = useParams()
  const { beeApi } = useContext(SettingsContext)
  const { status } = useContext(BeeContext)

  const navigate = useNavigate()

  const [available, setAvailable] = useState(false)

  const identity = identities.find(x => x.uuid === uuid)

  useEffect(() => {
    if (!identity || !identity.feedHash) {
      return
    }

    try {
      beeApi?.downloadData(identity.feedHash).then(() => setAvailable(true))
    } catch {
      setAvailable(false)
    }
  }, [beeApi, uuid, identity])

  if (!identity || !status.all) {
    navigate(ROUTES.FEEDS, { replace: true })

    return <></>
  }

  function onClose() {
    navigate(ROUTES.FEEDS)
  }

  return (
    <div>
      <HistoryHeader>{`${identity.name} Website`}</HistoryHeader>
      <UploadArea showHelp={false} uploadOrigin={{ origin: 'FEED', uuid }} />
      {available && identity.feedHash ? (
        <>
          <Box mb={0.25}>
            <ExpandableListItemKey label="Feed hash" value={identity.feedHash} />
          </Box>
          <Box mb={4}>
            <ExpandableListItemLink
              label="BZZ Link"
              value={`https://${swarmCid.encodeFeedReference(identity.feedHash)}.bzz.link`}
            />
          </Box>
        </>
      ) : (
        <Box mb={4}>
          <DocumentationText>
            This feed is curently not pointing anywhere, you can update the feed to fix this. Please refer to the{' '}
            <a
              href="https://docs.ethswarm.org/api/#tag/Feed/paths/~1feeds~1{owner}~1{topic}/post"
              target="_blank"
              rel="noreferrer"
            >
              official Bee documentation
            </a>
            .
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
