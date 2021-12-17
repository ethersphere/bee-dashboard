import { Box, Typography } from '@material-ui/core'
import { ReactElement, useContext, useState } from 'react'
import { Download, Info, PlusSquare, Trash } from 'react-feather'
import { useHistory } from 'react-router'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItem from '../../components/ExpandableListItem'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as IdentityContext, Identity } from '../../providers/Feeds'
import { ROUTES } from '../../routes'
import { formatEnum } from '../../utils'
import { persistIdentitiesWithoutUpdate } from '../../utils/identity'
import { DeleteFeedDialog } from './DeleteFeedDialog'
import { ExportFeedDialog } from './ExportFeedDialog'
import { ImportFeedDialog } from './ImportFeedDialog'

export default function Feeds(): ReactElement {
  const { identities, setIdentities } = useContext(IdentityContext)
  const history = useHistory()

  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null)
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
    setSelectedIdentity(null)
  }

  function onDelete(identity: Identity) {
    onDialogClose()
    const updatedFeeds = identities.filter(x => x.uuid !== identity.uuid)
    setIdentities(updatedFeeds)
    persistIdentitiesWithoutUpdate(updatedFeeds)
  }

  function onShowExport(identity: Identity) {
    setSelectedIdentity(identity)
    setShowExport(true)
  }

  function onShowDelete(identity: Identity) {
    setSelectedIdentity(identity)
    setShowDelete(true)
  }

  return (
    <div>
      {showImport && <ImportFeedDialog onClose={() => setShowImport(false)} />}
      {showExport && selectedIdentity && <ExportFeedDialog identity={selectedIdentity} onClose={onDialogClose} />}
      {showDelete && selectedIdentity && (
        <DeleteFeedDialog
          identity={selectedIdentity}
          onClose={onDialogClose}
          onConfirm={(identity: Identity) => onDelete(identity)}
        />
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
      {identities.map((x, i) => (
        <ExpandableList key={i} label={`${x.name} Website`} defaultOpen>
          <Box mb={0.5}>
            <ExpandableList label={x.name} level={1}>
              <ExpandableListItemKey label="Identity address" value={x.address} />
              <ExpandableListItem label="Identity type" value={formatEnum(x.type)} />
            </ExpandableList>
          </Box>
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
      ))}
    </div>
  )
}
