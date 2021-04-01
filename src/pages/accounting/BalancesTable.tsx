import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Container, CircularProgress, TableFooter, TablePagination } from '@material-ui/core';

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
                    {props.peerBalances?.balances.slice(page * 20, page * 20 + 20).map((peerBalance: PeerBalance, idx: number) => (
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
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        count={props.peerBalances?.balances ? props.peerBalances?.balances.length : 0}
                        rowsPerPage={20}
                        colSpan={3}
                        rowsPerPageOptions={[20]}
                        page={page}
                        onChangePage={handleChangePage}
                        />
                    </TableRow>
                </TableFooter>
            </TableContainer>}
        </div>
    )
}

export default BalancesTable;
