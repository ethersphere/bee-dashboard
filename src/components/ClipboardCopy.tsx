import IconButton from '@mui/material/IconButton'
import { useSnackbar } from 'notistack'
import type { ReactElement } from 'react'
import Clipboard from 'remixicon-react/ClipboardLineIcon'

interface Props {
  value: string
}

export default function ClipboardCopy({ value }: Props): ReactElement {
  const { enqueueSnackbar } = useSnackbar()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      enqueueSnackbar(`Copied: ${value}`, { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to copy to clipboard', { variant: 'error' })
    }
  }

  return (
    <div style={{ marginRight: '3px', marginLeft: '3px' }}>
      <IconButton color="primary" size="small" onClick={handleCopy}>
        <Clipboard style={{ height: '20px' }} />
      </IconButton>
    </div>
  )
}
