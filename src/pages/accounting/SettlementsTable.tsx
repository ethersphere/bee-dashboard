import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Paper, Container, CircularProgress, TableFooter, TablePagination  } from '@material-ui/core';

import { ConvertBalanceToBZZ } from '../../utils/common';

import type { AllSettlements, Settlements } from '@ethersphere/bee-js'

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });


interface IProps {
    nodeSettlements: AllSettlements | null,
    loading?: boolean,
}
  
function SettlementsTable(props: IProps) {
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
                        <TableCell>Received (BZZ)</TableCell>
                        <TableCell>Sent (BZZ)</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.nodeSettlements?.settlements.slice(page * 20, page * 20 + 20).map((item: Settlements, idx: number) => (
                        <TableRow key={item.peer}>
                        <TableCell>{item.peer}</TableCell>
                        <TableCell style={{ fontFamily: 'monospace, monospace'}}>
                            {item.received > 0 ? ConvertBalanceToBZZ(item.received).toFixed(7).toLocaleString() : item.received}
                            </TableCell>
                        <TableCell style={{ fontFamily: 'monospace, monospace'}}>
                            {item.sent > 0 ? ConvertBalanceToBZZ(item.sent).toFixed(7).toLocaleString() : item.sent}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        count={props.nodeSettlements?.settlements ? props.nodeSettlements?.settlements.length : 0}
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

export default SettlementsTable;
