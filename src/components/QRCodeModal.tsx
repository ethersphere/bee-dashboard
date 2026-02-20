import { FilterCenterFocusSharp } from '@mui/icons-material'
import { Dialog, DialogTitle, IconButton } from '@mui/material'
import { ReactElement, useState } from 'react'
import QRCode from 'react-qr-code'

interface Props {
  value: string
  label: string
}

export default function QRCodeModal(props: Props): ReactElement {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <IconButton color="primary" size="small" onClick={handleOpen}>
        <FilterCenterFocusSharp />
      </IconButton>
      <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
        <div style={{ padding: '30px', textAlign: 'center' }}>
          <DialogTitle id="simple-dialog-title">{props.label}</DialogTitle>
          <QRCode value={props.value} size={150} bgColor={'#ffffff'} fgColor={'#000000'} level={'L'} />
        </div>
      </Dialog>
    </div>
  )
}
