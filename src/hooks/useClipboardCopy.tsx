import { IconButton } from '@mui/material'
import { closeSnackbar, useSnackbar } from 'notistack'
import { useState } from 'react'
import CloseLineIcon from 'remixicon-react/CloseLineIcon'

export function useClipboardCopy(value: string) {
  const { enqueueSnackbar } = useSnackbar()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      enqueueSnackbar(`Failed to copy text`, {
        variant: 'error',
        action: key => (
          <IconButton onClick={() => closeSnackbar(key)} size="small" color="inherit">
            <CloseLineIcon fontSize="small" />
          </IconButton>
        ),
      })
    }
  }

  const tooltipCloseHandler = () => setCopied(false)

  return {
    copied,
    handleCopy,
    tooltipCloseHandler,
  }
}
