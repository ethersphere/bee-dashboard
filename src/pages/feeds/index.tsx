import { Box, Typography } from '@material-ui/core'
import { ReactElement, useContext } from 'react'
import { Info, PlusSquare } from 'react-feather'
import { useHistory } from 'react-router'
import ExpandableList from '../../components/ExpandableList'
import ExpandableListItemKey from '../../components/ExpandableListItemKey'
import { SwarmButton } from '../../components/SwarmButton'
import { Context as FeedsContext } from '../../providers/Feeds'
import { Context as SettingsContext } from '../../providers/Settings'
import { ROUTES } from '../../routes'

export default function Feeds(): ReactElement {
  const { feeds } = useContext(FeedsContext)
  const { apiUrl } = useContext(SettingsContext)
  const history = useHistory()

  function createNewFeed() {
    return history.push(ROUTES.FEEDS_NEW)
  }

  function viewWebsite(hash: string) {
    window.open(`${apiUrl}/bzz/${hash}/`, '_blank')
  }

  return (
    <div>
      <Box mb={4}>
        <Typography variant="h1">Feeds</Typography>
      </Box>
      <Box mb={4}>
        <SwarmButton iconType={PlusSquare} onClick={createNewFeed}>
          Create New Feed
        </SwarmButton>
      </Box>
      {feeds.map((x, i) => (
        <ExpandableList key={i} label={`${x.name} Website`} defaultOpen>
          <ExpandableList label={x.name} defaultOpen level={1}>
            <ExpandableListItemKey label="Topic" value={'00'.repeat(32)} />
            <ExpandableListItemKey label="Feed hash" value={x.feedHash} />
            <Box mt={0.75}>
              <SwarmButton onClick={() => viewWebsite(x.feedHash)} iconType={Info}>
                View Feed Page
              </SwarmButton>
            </Box>
          </ExpandableList>
        </ExpandableList>
      ))}
    </div>
  )
}
