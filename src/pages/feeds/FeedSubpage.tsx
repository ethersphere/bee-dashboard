import { Box } from '@material-ui/core'
import { ReactElement, useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import X from 'remixicon-react/CloseLineIcon'
import { DocumentationText } from '../../components/DocumentationText'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import { HistoryHeader } from '../../components/HistoryHeader'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as BeeContext } from '../../providers/Bee'
import { Identity, Context as IdentityContext } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'
import { UploadArea } from '../files/UploadArea'
import { readFeed } from '../../utils/identity'

export function FeedSubpage(): ReactElement {
  const { identities } = useContext(IdentityContext)
  const { posts } = useContext(IdentityContext)
  const { uuid } = useParams()
  const { beeApi, beeDebugApi } = useContext(SettingsContext)
  const { status } = useContext(BeeContext)

  const navigate = useNavigate()

  const [available, setAvailable] = useState(false)

  const identity = identities.find(x => x.uuid === uuid)

  if (!beeApi || !beeDebugApi) {
    return <></>
  }

  if (identity?.topic === '') {
  } else {
    try {
      const readPostArray = readFeed(beeApi, beeDebugApi, identity as Identity)
    } catch (error) {
      return <></>
    }
  }

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
    navigate(ROUTES.ACCOUNT_FEEDS, { replace: true })

    return <></>
  }

  function onClose() {
    navigate(ROUTES.ACCOUNT_FEEDS)
  }

  return (
    <div>
      <HistoryHeader>{`${identity.name} Website`}</HistoryHeader>
      {identity.topic === '' ? (
        <UploadArea showHelp={false} uploadOrigin={{ origin: 'FEED', uuid }} />
      ) : (
        <UploadArea showHelp={false} uploadOrigin={{ origin: 'POST', uuid }} />
      )}
      {available && identity.feedHash ? (
        <>
          <Box mb={4}>
            <ExpandableListItemKey label="Feed hash" value={identity.feedHash} />
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
      // Posts form
      {posts.map((x, i) => (
        <ExpandableList key={i} label={`${x.Title} Website`} defaultOpen>
          <Box mb={0.5}>
            <ExpandableList label={x.Title} level={1}>
              <ExpandableListItem label="Post Type" value={x.Type} />
              <ExpandableListItem label="Post Date" value={x.Date} />
              <ExpandableListItem label="Post Amount" value={x.Amount} />
              <ExpandableListItem label="Post Provider" value={x.Provider} />
              <ExpandableListItem label="Post Place" value={x.Place} />
              /* Add a clickable bzz link to a bill scan here */
            </ExpandableList>
          </Box>
        </ExpandableList>
      ))}
      <ExpandableListItemActions>
        <SwarmButton iconType={X} onClick={onClose} cancel>
          Close
        </SwarmButton>
      </ExpandableListItemActions>
    </div>
  )
}
