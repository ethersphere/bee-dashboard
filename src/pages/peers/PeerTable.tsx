import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper, Tooltip, Container, CircularProgress, TablePagination, TableFooter } from '@material-ui/core';
import { Autorenew } from '@material-ui/icons';

import { beeDebugApi } from '../../services/bee';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  
function PeerTable(props: any) {
    const classes = useStyles();

    const [page, setPage] = React.useState(0);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const [peerLatency, setPeerLatency] = useState([{ peerId: '', rtt: '', loading: false }]);

    const PingPeer = async (peerId: string) => {
        
        setPeerLatency([...peerLatency, { peerId: peerId, rtt: '', loading: true }])
        beeDebugApi.connectivity.ping(peerId)
        .then(res => {
            setPeerLatency([...peerLatency, { peerId: peerId, rtt: res.data.rtt, loading: false }])
        })
        .catch(error => {
            setPeerLatency([...peerLatency, { peerId: peerId, rtt: 'error', loading: false }])
        })
    }

    return (
        <div>
            {props.loading ? 
            <Container style={{textAlign:'center', padding:'50px'}}>
                <CircularProgress />
            </Container>
            :
             <TableContainer component={Paper}>
                <Table size="small" className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Peer</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.nodePeers.peers.slice(page * 20, page * 20 + 20).map((peer: any, idx: number) => (
                        <TableRow key={peer.address}>
                        <TableCell>{peer.address}</TableCell>
                        <TableCell align="right">
                            <Tooltip title="Ping node">
                                <Button color="primary" onClick={() => PingPeer(peer.address)} >
                                {peerLatency.find(item => item.peerId === peer.address) ? 
                                    peerLatency.filter(item => item.peerId === peer.address)[0].loading ? <CircularProgress size={20} /> :
                                    peerLatency.filter(item => item.peerId === peer.address)[0].rtt :
                                <Autorenew />}
                                </Button>
                            </Tooltip>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        count={props.nodePeers.peers.length}
                        rowsPerPage={20}
                        colSpan={3}
                        rowsPerPageOptions={[20]}
                        page={page}
                        onChangePage={handleChangePage}
                        />
                    </TableRow>
                </TableFooter>
            </TableContainer>
            }
        </div>
    )
}

export default PeerTable
