import { Box, TextareaAutosize } from '@mui/material'
import { useSnackbar } from 'notistack'
import React, { ReactElement, useContext, useRef, useState } from 'react'
import Check from 'remixicon-react/CheckLineIcon'
import Upload from 'remixicon-react/UploadLineIcon'
import { makeStyles } from 'tss-react/mui'

import ExpandableListItemActions from '../../components/ExpandableListItemActions'
import { SwarmButton } from '../../components/SwarmButton'
import { SwarmDialog } from '../../components/SwarmDialog'
import { SwarmTextInput } from '../../components/SwarmTextInput'
import { TitleWithClose } from '../../components/TitleWithClose'
import { Context, Identity } from '../../providers/Feeds'
import { importIdentity, persistIdentity } from '../../utils/identity'

interface Props {
  onClose: () => void
}

const useStyles = makeStyles()(theme => ({
  textarea: {
    width: '100%',
    border: 0,
    padding: theme.spacing(1),
  },
  displayNone: {
    display: 'none',
  },
}))

export function ImportFeedDialog({ onClose }: Props): ReactElement {
  const [textareaValue, setTextareaValue] = useState('')
  const [name, setName] = useState('')
  const fileInputRef = useRef(null)

  const { identities, setIdentities } = useContext(Context)

  const { enqueueSnackbar } = useSnackbar()

  const { classes } = useStyles()

  async function onImport() {
    const feed = await importIdentity(name, textareaValue)

    if (feed) {
      onFeedReady(feed)
    } else {
      enqueueSnackbar('Feed is not valid', { variant: 'error' })
    }
  }

  function onUploadIdentityFile() {
    if (fileInputRef.current) {
      const input = fileInputRef.current as HTMLInputElement
      input.click()
    }
  }

  function onIdentityFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const fileReader = new FileReader()
    const file = event.target?.files?.[0]
    fileReader.onload = async event => {
      const string = event.target?.result

      if (string) {
        const feed = await importIdentity(name, string as string)

        if (feed) {
          onFeedReady(feed)
        } else {
          enqueueSnackbar('Feed is not valid', { variant: 'error' })
        }
      }
    }

    if (file) {
      fileReader.readAsText(file)
    }
  }

  function onFeedReady(identity: Identity) {
    persistIdentity(identities, identity)
    setIdentities(identities)
    enqueueSnackbar('Feed imported successfully', { variant: 'success' })
    onClose()
  }

  return (
    <SwarmDialog>
      <input onChange={onIdentityFileSelected} ref={fileInputRef} className={classes.displayNone} type="file" />
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
        <SwarmButton iconType={Upload} onClick={onUploadIdentityFile}>
          Upload Json File
        </SwarmButton>
        <SwarmButton iconType={Check} onClick={onImport}>
          Use Pasted Text
        </SwarmButton>
      </ExpandableListItemActions>
    </SwarmDialog>
  )
}
