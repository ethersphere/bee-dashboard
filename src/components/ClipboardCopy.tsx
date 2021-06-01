import type { ReactElement } from 'react'
import IconButton from '@material-ui/core/IconButton'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Clipboard } from 'react-feather'
import { withSnackbar, WithSnackbarProps } from 'notistack'

interface Props extends WithSnackbarProps {
  value: string
}

function ClipboardCopy({ value, enqueueSnackbar }: Props): ReactElement {
  const handleCopy = () => enqueueSnackbar(`Copied: ${value}`, { variant: 'success' })

  return (
    <div style={{ marginRight: '3px', marginLeft: '3px' }}>
      <IconButton color="primary" size="small" onClick={handleCopy}>
        <CopyToClipboard text={value}>
          <Clipboard style={{ height: '20px' }} />
        </CopyToClipboard>
      </IconButton>
    </div>
  )
}

export default withSnackbar(ClipboardCopy)
