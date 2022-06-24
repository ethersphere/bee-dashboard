import { Box } from '@material-ui/core'
import { ReactElement, useContext, useState } from 'react'
import Download from 'remixicon-react/Download2LineIcon'
import Info from 'remixicon-react/InformationLineIcon'
import PlusSquare from 'remixicon-react/AddBoxLineIcon'
import Trash from 'remixicon-react/DeleteBin7LineIcon'
import { useNavigate } from 'react-router'
import ExpandableList from '../../../components/ExpandableList'
import ExpandableListItem from '../../../components/ExpandableListItem'
import ExpandableListItemActions from '../../../components/ExpandableListItemActions'
import ExpandableListItemKey from '../../../components/ExpandableListItemKey'
import { SwarmButton } from '../../../components/SwarmButton'
import { Context as IdentityContext, Identity } from '../../../providers/Feeds'
import { ROUTES } from '../../../routes'
import { formatEnum } from '../../../utils'
import { persistIdentitiesWithoutUpdate } from '../../../utils/identity'
import { DeleteFeedDialog } from '../../feeds/DeleteFeedDialog'
import { ExportFeedDialog } from '../../feeds/ExportFeedDialog'
import { ImportFeedDialog } from '../../feeds/ImportFeedDialog'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'
import TroubleshootConnectionCard from '../../../components/TroubleshootConnectionCard'
import { CheckState, Context as BeeContext } from '../../../providers/Bee'

export function AccountFeeds(): ReactElement {
  const { identities, setIdentities } = useContext(IdentityContext)
  const { status } = useContext(BeeContext)

  const navigate = useNavigate()

  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null)
  const [showImport, setShowImport] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  function createNewFeed() {
    return navigate(ROUTES.ACCOUNT_FEEDS_NEW)
  }

  function viewFeed(uuid: string) {
    navigate(ROUTES.ACCOUNT_FEEDS_VIEW.replace(':uuid', uuid))
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

  if (status.all === CheckState.ERROR) return <TroubleshootConnectionCard />

  return (
    <>
      <Header />
      <AccountNavigation active="FEEDS" />
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
    </>
  )
}
