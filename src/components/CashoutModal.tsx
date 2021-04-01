import React from 'react';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Snackbar, Container, CircularProgress } from '@material-ui/core';

import { beeDebugApi } from '../services/bee';

import EthereumAddress from './EthereumAddress';

export default function DepositModal() {
  const [open, setOpen] = React.useState<boolean>(false);
  const [peerId, setPeerId] = React.useState('');
  const [loadingCashout, setLoadingCashout] = React.useState<boolean>(false);
  const [showToast, setToastVisibility] = React.useState<boolean>(false);
  const [toastContent, setToastContent] = React.useState<JSX.Element | null>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCashout = () => {
    if (peerId) {
        setLoadingCashout(true)
        beeDebugApi.chequebook.peerCashout(peerId)
        .then(res => {
            setOpen(false);
            handleToast(<span>Successfully cashed out cheque. Transaction 
              <EthereumAddress
              hideBlockie
              address={res.data.transactionHash}
              network={'goerli'}
              />
            </span>)
        })
        .catch(error => {
          handleToast(<span>Error with cashout</span>)
        })
        .finally(() => {
          setLoadingCashout(false)
        })
    } else {
        handleToast(<span>Peer Id invalid</span>)
    }
  };

  const handleToast = (text: JSX.Element) => {
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
        {loadingCashout ?
          <Container style={{textAlign:'center', padding:'50px'}}>
              <CircularProgress />
          </Container>
          :
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
        </DialogContent>}
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
