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
import { Identity } from '../../providers/Feeds'

interface Props {
  identity: Identity
  onClose: () => void
}

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      maxWidth: '100%',
    },
  }),
)

export function ExportFeedDialog({ identity, onClose }: Props): ReactElement {
  const { enqueueSnackbar } = useSnackbar()

  const classes = useStyles()

  function onDownload() {
    saveAs(
      new Blob([identity.identity], {
        type: 'application/json',
      }),
      identity.name + '.json',
    )
  }

  function getExportText() {
    return identity.type === 'V3' ? 'JSON file' : 'the private key string'
  }

  function onCopy() {
    navigator.clipboard
      .writeText(identity.identity)
      .then(() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' }))
  }

  return (
    <SwarmDialog>
      <Box mb={4}>
        <TitleWithClose onClose={onClose}>Export</TitleWithClose>
      </Box>
      <Box mb={2}>
        <Typography align="center">{`We exported the identity associated with this feed as ${getExportText()}.`}</Typography>
      </Box>
      <Box mb={4} className={classes.wrapper}>
        <Code prettify>{identity.identity}</Code>
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
