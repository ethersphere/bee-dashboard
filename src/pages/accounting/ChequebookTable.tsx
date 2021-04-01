import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Container, CircularProgress, TablePagination, TableFooter  } from '@material-ui/core';

import { ConvertBalanceToBZZ } from '../../utils/common';
import EthereumAddress from '../../components/EthereumAddress';
import ClipboardCopy from '../../components/ClipboardCopy';
import PeerDetailDrawer from './PeerDetailDrawer';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

interface ChequeEvent {
    beneficiary: string,
    chequebook: string,
    payout: number,
}

interface PeerCheque {
    lastreceived?: ChequeEvent,
    lastsent?: ChequeEvent,
    peer: string,
}

interface PeerCheques {
    lastcheques: Array<PeerCheque>
}

interface IProps {
    peerCheques: PeerCheques | null,
    loading?: boolean,
}
  
function ChequebookTable(props: IProps) {
    const classes = useStyles();

    const [page, setPage] = React.useState(0);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    return (
        <div>
            {props.loading ? 
            <Container style={{textAlign:'center', padding:'50px'}}>
                <CircularProgress />
            </Container>
            :
            <div>
             <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Peer</TableCell>
                        <TableCell>Last Received</TableCell>
                        <TableCell>Last Sent</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.peerCheques?.lastcheques.slice(page * 20, page * 20 + 20).map((peerCheque: PeerCheque, idx: number) => (
                        <TableRow key={peerCheque.peer}>
                        <TableCell>
                            <div style={{display:'flex'}}>
                                <small>
                                  <PeerDetailDrawer 
                                  peerId={peerCheque.peer}
                                  />
                                </small>
                                <ClipboardCopy value={peerCheque.peer} />
                            </div>
                        </TableCell>
                        <TableCell style={{maxWidth:'200px'}}>
                            <p style={{marginBottom: '0px', fontFamily: 'monospace, monospace'}}>
                                {peerCheque.lastreceived?.payout ? ConvertBalanceToBZZ(peerCheque.lastreceived?.payout).toFixed(7).toLocaleString() : '-'}
                            </p>
                            <p style={{marginBottom: '0px'}}>
                                <small>{peerCheque.lastreceived ?
                                <EthereumAddress
                                hideBlockie
                                truncate
                                network='goerli'
                                address={peerCheque.lastreceived.beneficiary}
                                /> : null}
                                </small>
                            </p>
                        </TableCell>
                        <TableCell style={{maxWidth:'200px'}}>
                            <p  style={{marginBottom: '0px', fontFamily: 'monospace, monospace'}}>
                                {peerCheque.lastsent?.payout ? ConvertBalanceToBZZ(peerCheque.lastsent?.payout).toFixed(7).toLocaleString() : '-'}
                            </p>
                            <p style={{marginBottom: '0px'}}>
                                <small>{peerCheque.lastsent ?
                                <EthereumAddress
                                hideBlockie
                                truncate
                                network='goerli'
                                address={peerCheque.lastsent.beneficiary}
                                /> : null}
                                </small>
                            </p>
                        </TableCell>
                        <TableCell align="right">
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        count={props.peerCheques?.lastcheques ? props.peerCheques?.lastcheques.length : 0}
                        rowsPerPage={20}
                        colSpan={3}
                        rowsPerPageOptions={[20]}
                        page={page}
                        onChangePage={handleChangePage}
                        />
                    </TableRow>
                </TableFooter>
            </TableContainer>
            </div>}
        </div>
    )
}

export default ChequebookTable;
