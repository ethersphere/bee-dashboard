import React from 'react';
import QRCode from 'qrcode.react';
import { IconButton, Dialog, DialogTitle } from '@material-ui/core';
import { FilterCenterFocusSharp } from '@material-ui/icons';

interface IProps {
    value: string,
    label: string,
}

export default function QRCodeModal(props: IProps) {
    const [open, setOpen] = React.useState(false);
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <IconButton color="primary" size='small' onClick={handleOpen}>
          <FilterCenterFocusSharp/>
        </IconButton>
        <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <div style={{padding: '30px', textAlign: 'center'}}>
                <DialogTitle id="simple-dialog-title">{ props.label }</DialogTitle>
                <QRCode
                value={props.value}
                size={150}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
                renderAs={"svg"}
                />
            </div>
        </Dialog>
      </div>
    );
  }
