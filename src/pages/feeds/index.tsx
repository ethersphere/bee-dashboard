import { Box, Typography } from '@material-ui/core'
import { ReactElement, useContext, useState } from 'react'
import { Download, Info, PlusSquare, Trash } from 'react-feather'
import { useHistory } from 'react-router'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as FeedsContext, Feed } from '../../providers/Feeds'
import { ROUTES } from '../../routes'
import { persistIdentitiesWithoutUpdate } from '../../utils/identity'
import { DeleteFeedDialog } from './DeleteFeedDialog'
import { ExportFeedDialog } from './ExportFeedDialog'
import { ImportFeedDialog } from './ImportFeedDialog'

export default function Feeds(): ReactElement {
  const { feeds, setFeeds } = useContext(FeedsContext)
  const history = useHistory()

  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  function createNewFeed() {
    return history.push(ROUTES.FEEDS_NEW)
  }

  function viewFeed(uuid: string) {
    history.push(ROUTES.FEEDS_PAGE.replace(':uuid', uuid))
  }

  function onDialogClose() {
    setShowDelete(false)
    setShowExport(false)
    setShowImport(false)
    setSelectedFeed(null)
  }

  function onDelete(feed: Feed) {
    onDialogClose()
    const updatedFeeds = feeds.filter(x => x.uuid !== feed.uuid)
    setFeeds(updatedFeeds)
    persistIdentitiesWithoutUpdate(updatedFeeds)
  }

  function onShowExport(feed: Feed) {
    setSelectedFeed(feed)
    setShowExport(true)
  }

  function onShowDelete(feed: Feed) {
    setSelectedFeed(feed)
    setShowDelete(true)
  }

  return (
    <div>
      {showImport && <ImportFeedDialog onClose={() => setShowImport(false)} />}
      {showExport && selectedFeed && <ExportFeedDialog feed={selectedFeed} onClose={onDialogClose} />}
      {showDelete && selectedFeed && (
        <DeleteFeedDialog feed={selectedFeed} onClose={onDialogClose} onConfirm={(feed: Feed) => onDelete(feed)} />
      )}
      <Box mb={4}>
        <Typography variant="h1">Feeds</Typography>
      </Box>
      <Box mb={4}>
        <ExpandableListItemActions>
          <SwarmButton iconType={PlusSquare} onClick={createNewFeed}>
            Create New Feed
          </SwarmButton>
          <SwarmButton iconType={PlusSquare} onClick={() => setShowImport(true)}>
            Import Feed
          </SwarmButton>
        </ExpandableListItemActions>
      </Box>
      {feeds.map((x, i) => (
        <ExpandableList key={i} label={`${x.name} Website`} defaultOpen>
          <ExpandableList label={x.name} defaultOpen level={1}>
            <ExpandableListItemKey label="Topic" value={'00'.repeat(32)} />
            {x.feedHash && <ExpandableListItemKey label="Feed hash" value={x.feedHash} />}
            <Box mt={0.75}>
              <ExpandableListItemActions>
                <SwarmButton onClick={() => viewFeed(x.uuid)} iconType={Info}>
                  View Feed Page
                </SwarmButton>
                <SwarmButton onClick={() => onShowExport(x)} iconType={Download}>
                  Export...
                </SwarmButton>
                <SwarmButton onClick={() => onShowDelete(x)} iconType={Trash}>
                  Delete...
                </SwarmButton>
              </ExpandableListItemActions>
            </Box>
          </ExpandableList>
        </ExpandableList>
      ))}
    </div>
  )
}
