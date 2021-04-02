import React from 'react'
import { IconButton, Snackbar } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Clipboard } from 'react-feather'

interface IProps {
  value: string
}

export default function ClipboardCopy(props: IProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div style={{ marginRight: '3px', marginLeft: '3px' }}>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={copied} message="Copied" />
      <IconButton color="primary" size="small" onClick={handleCopy}>
        <CopyToClipboard text={props.value}>
          <Clipboard style={{ height: '20px' }} />
        </CopyToClipboard>
      </IconButton>
    </div>
  )
}
