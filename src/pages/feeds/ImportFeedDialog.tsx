import { Box, createStyles, makeStyles, TextareaAutosize, Theme } from '@material-ui/core'
import { useSnackbar } from 'notistack'
import { ReactElement, useContext, useState } from 'react'
import { Check } from 'react-feather'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDialog } from '../../components/SwarmDialog'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { TitleWithClose } from '../../components/TitleWithClose'
import { Context, Feed } from '../../providers/Feeds'
import { importIdentity, persistIdentity } from '../../utils/identity'

interface Props {
  onClose: () => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textarea: {
      width: '100%',
      border: 0,
      padding: theme.spacing(1),
    },
  }),
)

export function ImportFeedDialog({ onClose }: Props): ReactElement {
  const [textareaValue, setTextareaValue] = useState('')
  const [name, setName] = useState('')

  const { feeds, setFeeds } = useContext(Context)

  const { enqueueSnackbar } = useSnackbar()

  const classes = useStyles()

  function onImport() {
    const feed = importIdentity(name, textareaValue)

    if (feed) {
      onFeedReady(feed)
    } else {
      enqueueSnackbar('Feed is not valid', { variant: 'error' })
    }
  }

  function onFeedReady(feed: Feed) {
    persistIdentity(feeds, feed)
    setFeeds(feeds)
    enqueueSnackbar('Feed imported successfully', { variant: 'success' })
  }

  return (
    <SwarmDialog>
      <Box mb={4}>
        <TitleWithClose onClose={onClose}>Import</TitleWithClose>
      </Box>
      <Box mb={2}>
        <SwarmTextInput label="Identity Name" name="name" onChange={event => setName(event.target.value)} />
      </Box>
      <Box mb={4}>
        <TextareaAutosize
          className={classes.textarea}
          minRows={5}
          onChange={event => setTextareaValue(event.target.value)}
        />
      </Box>
      <ExpandableListItemActions>
        <SwarmButton iconType={Check} onClick={onImport}>
          Import
        </SwarmButton>
      </ExpandableListItemActions>
    </SwarmDialog>
  )
}
