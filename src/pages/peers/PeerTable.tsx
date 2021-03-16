import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableRow, TableHead, Button, Paper, Tooltip, Container, CircularProgress, TablePagination, TableFooter } from '@material-ui/core';
import { Cancel, Autorenew } from '@material-ui/icons';

import { beeDebugApi } from '../../services/bee';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

  
function PeerTable(props: any) {
    const classes = useStyles();

    const [peerLatency, setPeerLatency] = useState([{ peerId: '', rtt: '', loading: false }]);
    const [removingPeer, setRemovingPeer] = useState(false);

    const [page, setPage] = React.useState(0);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

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

    const removePeer = (peerId: string) => {
        setRemovingPeer(true)
        beeDebugApi.connectivity.removePeer(peerId)
        .then(res => {
            window.location.reload()
            setRemovingPeer(false)
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            setRemovingPeer(false)
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
                <Table className={classes.table} size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Peer</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.nodePeers.peers.slice(page * 10, page * 10 + 10)
                    .map((peer: any, idx: number) => (
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
                            
                            {/* <Tooltip title="Remove peer">
                                <Button color="primary" onClick={() => removePeer(peer.address)} >
                                    <Cancel />
                                </Button>
                            </Tooltip> */}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                        count={props.nodePeers.peers.length}
                        rowsPerPage={10}
                        colSpan={3}
                        rowsPerPageOptions={[10]}
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
