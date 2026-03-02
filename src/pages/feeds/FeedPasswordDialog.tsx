import { Box, Typography } from '@mui/material'
import { ReactElement, useState } from 'react'
import Check from 'remixicon-react/CheckLineIcon'
import X from 'remixicon-react/CloseLineIcon'

import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDialog } from '../../components/SwarmDialog'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { TitleWithClose } from '../../components/TitleWithClose'

interface Props {
  feedName: string
  onProceed: (password: string) => void
  onCancel: () => void
  loading: boolean
}

export function FeedPasswordDialog({ feedName, onProceed, onCancel, loading }: Props): ReactElement {
  const [password, setPassword] = useState('')

  function onProceedClick() {
    return onProceed(password)
  }

  return (
    <SwarmDialog>
      <Box mb={4}>
        <TitleWithClose onClose={onCancel}>Update Feed</TitleWithClose>
      </Box>
      <Box mb={2}>
        <Typography>Please enter the password for “{feedName}”:</Typography>
      </Box>
      <Box mb={4}>
        <SwarmTextInput
          label="Password"
          name="password"
          onChange={event => {
            setPassword(event.target.value)
          }}
          password
        />
      </Box>
      <ExpandableListItemActions>
        <SwarmButton iconType={Check} onClick={onProceedClick} disabled={loading} loading={loading}>
          Proceed
        </SwarmButton>
        <SwarmButton iconType={X} onClick={onCancel} cancel disabled={loading}>
          Cancel
        </SwarmButton>
      </ExpandableListItemActions>
    </SwarmDialog>
  )
}
