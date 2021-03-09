import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper, Tooltip, Container, CircularProgress  } from '@material-ui/core';

import { ConvertBalanceToBZZ } from '../../utils/common';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

interface Settlement {
    received: number,
    sent: number,
    peer: string,
}

interface Settlements {
    settlements: Array<Settlement>,
    totalreceived: number,
    totalsent: number,
}

interface IProps {
    nodeSettlements: Settlements,
    loading?: boolean,
}
  
function SettlementsTable(props: IProps) {
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
                        <TableCell>Received</TableCell>
                        <TableCell>Sent</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.nodeSettlements.settlements.map((item: Settlement, idx: number) => (
                        <TableRow key={item.peer}>
                        <TableCell>{item.peer}</TableCell>
                        <TableCell>{ConvertBalanceToBZZ(item.received)}</TableCell>
                        <TableCell>{ConvertBalanceToBZZ(item.sent)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    )
}

export default SettlementsTable;
