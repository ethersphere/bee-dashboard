import { Box, Typography } from '@material-ui/core'
import { ReactElement } from 'react'
import { Trash, X } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDialog } from '../../components/SwarmDialog'
import { TitleWithClose } from '../../components/TitleWithClose'
import { Identity } from '../../providers/Feeds'

interface Props {
  identity: Identity
  onConfirm: (identity: Identity) => void
  onClose: () => void
}

export function DeleteFeedDialog({ identity, onConfirm, onClose }: Props): ReactElement {
  return (
    <SwarmDialog>
      <Box mb={4}>
        <TitleWithClose onClose={onClose}>Delete</TitleWithClose>
      </Box>
      <Box mb={2}>
        <Typography align="center">{`You are about to delete feed ${identity.name} Website. It is strongly advised to export this feed first.`}</Typography>
      </Box>
      <ExpandableListItemActions>
        <SwarmButton iconType={Trash} onClick={() => onConfirm(identity)}>
          Delete
        </SwarmButton>
        <SwarmButton iconType={X} onClick={onClose} cancel>
          Cancel
        </SwarmButton>
      </ExpandableListItemActions>
    </SwarmDialog>
  )
}
