import React from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Snackbar } from '@material-ui/core';

import { beeDebugApi } from '../services/bee';

export default function DepositModal() {
  const [open, setOpen] = React.useState(false);
  const [peerId, setPeerId] = React.useState('');

  const [showToast, setToastVisibility] = React.useState(false);
  const [toastContent, setToastContent] = React.useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCashout = () => {
    if (peerId) {
        beeDebugApi.chequebook.peerCashout(peerId)
        .then(res => {
            setOpen(false);
            handleToast(`Successfully cashed out cheque. Transaction ${res.data.transactionHash}`)
        })
        .catch(error => {
            handleToast('Error with cashout')
        })
    } else {
        handleToast('Peer Id invalid')
    }
  };

  const handleToast = (text: string) => {
    setToastContent(text)
    setToastVisibility(true);
    setTimeout(
      () => setToastVisibility(false), 
      7000
    );
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen} style={{marginLeft:'7px'}}>
        Cashout
      </Button>
        <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showToast}
        message={toastContent}
        />
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Cashout Cheque</DialogTitle>
        <DialogContent>
          <DialogContentText style={{marginTop: '20px'}}>
            Specify the peer Id of the peer you would like to cashout.
          </DialogContentText>
          <Input
            autoFocus
            margin="dense"
            id="peerId"
            type="text"
            placeholder='Peer Id'
            fullWidth
            onChange={(e) => setPeerId(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCashout} color="primary">
            Cashout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
