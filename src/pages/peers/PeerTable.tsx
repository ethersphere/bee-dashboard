import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Paper from '@material-ui/core/Paper';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead } from '@material-ui/core';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  
function PeerTable(props: any) {
    const classes = useStyles();

    return (
        <div>
             <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Peer Id</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.nodePeers.peers.map((peer: any, idx: number) => (
                        <TableRow key={peer.address}>
                        <TableCell component="th" scope="row">
                            {idx + 1}
                        </TableCell>
                        <TableCell>{peer.address}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default PeerTable
