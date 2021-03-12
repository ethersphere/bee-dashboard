import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Container, CircularProgress } from '@material-ui/core';

import { ConvertBalanceToBZZ } from '../../utils/common';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

interface PeerBalance {
    balance: number,
    peer: string,
}

interface PeerBalances {
    balances: Array<PeerBalance>
}

interface IProps {
    peerBalances: PeerBalances | null,
    loading?: boolean,
}
  
function BalancesTable(props: IProps) {
    const classes = useStyles();

    return (
        <div>
            {props.loading ? 
            <Container style={{textAlign:'center', padding:'50px'}}>
                <CircularProgress />
            </Container>
            :
             <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Peer</TableCell>
                        <TableCell style={{textAlign:'right'}}>Balance (BZZ)</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.peerBalances?.balances.map((peerBalance: PeerBalance, idx: number) => (
                        <TableRow key={peerBalance.peer}>
                        <TableCell>{peerBalance.peer}</TableCell>
                        <TableCell style={{ color: ConvertBalanceToBZZ(peerBalance.balance) > 0 ? '#32c48d' : '#c9201f', textAlign:'right', fontFamily: 'monospace, monospace' }}>
                            {ConvertBalanceToBZZ(peerBalance.balance).toFixed(7).toLocaleString() }
                        </TableCell>
                        <TableCell align="right">
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    )
}

export default BalancesTable;
