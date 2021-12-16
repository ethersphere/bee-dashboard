import { Box, createStyles, makeStyles, Typography } from '@material-ui/core'
import { saveAs } from 'file-saver'
import { useSnackbar } from 'notistack'
import { ReactElement } from 'react'
import { Clipboard, Download } from 'react-feather'
import { Code } from '../../components/Code'
import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDialog } from '../../components/SwarmDialog'
import { TitleWithClose } from '../../components/TitleWithClose'
import { Feed } from '../../providers/Feeds'

interface Props {
  feed: Feed
  onClose: () => void
}

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      maxWidth: '100%',
    },
  }),
)

export function ExportFeedDialog({ feed, onClose }: Props): ReactElement {
  const { enqueueSnackbar } = useSnackbar()

  const classes = useStyles()

  function onDownload() {
    saveAs(
      new Blob([feed.identity], {
        type: 'application/json',
      }),
      feed.name + '.json',
    )
  }

  function onCopy() {
    navigator.clipboard
      .writeText(feed.identity)
      .then(() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' }))
  }

  return (
    <SwarmDialog>
      <Box mb={4}>
        <TitleWithClose onClose={onClose}>Export</TitleWithClose>
      </Box>
      <Box mb={2}>
        <Typography align="center">We exported the identity associated with this feed as JSON file.</Typography>
      </Box>
      <Box mb={4} className={classes.wrapper}>
        <Code prettify>{feed.identity}</Code>
      </Box>
      <ExpandableListItemActions>
        <SwarmButton iconType={Download} onClick={onDownload}>
          Download JSON File
        </SwarmButton>
        <SwarmButton iconType={Clipboard} onClick={onCopy}>
          Copy To Clipboard
        </SwarmButton>
      </ExpandableListItemActions>
    </SwarmDialog>
  )
}
