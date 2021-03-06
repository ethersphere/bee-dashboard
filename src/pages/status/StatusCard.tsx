import React from 'react'
import { Link } from 'react-router-dom';

import { Theme, createStyles, makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Chip } from '@material-ui/core/';
import { CheckCircle, Error } from '@material-ui/icons/';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
    },
    content: {
      flex: '1 0 auto',
    },
    status: {
        color: '#2145a0',
        backgroundColor: '#e1effe',
    }
  }),
);  


interface NodeHealth {
    status?: string,
    version?: string
}

interface NodeReadiness {
    status?: string,
    version?: string
}

interface NodeAddresses {
    overlay: string,
    underlay: string[],
    ethereum: string,
    public_key: string, 
    pss_public_key: string
}

interface NodeTopology {
    baseAddr: string,
    bins: string[],
    connected: number,
    depth: number, 
    nnLowWatermark: number,
    population: number,
    timestamp: string,
}


interface IProps{
    nodeHealth: NodeHealth,
    loadingNodeHealth: boolean,
    nodeReadiness: NodeReadiness,
    loadingNodeReadiness: boolean,
    beeRelease: any,
    loadingBeeRelease: boolean,
    nodeAddresses: NodeAddresses,
    nodeTopology: NodeTopology,
    loadingNodeTopology: boolean,
}

function StatusCard(props: IProps) {
    const classes = useStyles();
    const theme = useTheme();

    return (
        <div>
            <Card className={classes.root}>
                { !props.loadingNodeHealth && props.nodeHealth ? 
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5">
                        { props.nodeHealth.status === 'ok' ? 
                            <div>
                                <CheckCircle style={{color:'#32c48d', marginRight: '7px'}} />
                                <span>Connected to Bee Node</span>
                            </div>
                            : 
                            <div>
                                <Error style={{color:'#c9201f', marginRight: '7px'}} />
                                <span>Could not connect to Bee Node</span>
                            </div> 
                        }
                    </Typography>
                    <div style={{marginBottom: '10px' }}>
                        <span style={{marginRight:'20px'}}>Discovered Nodes: { props.nodeTopology.population }</span>
                        <span style={{marginRight:'20px'}}>
                            <span>Connected Peers: </span>
                            <Link to='/peers'>
                            { props.nodeTopology.connected }
                            </Link>
                        </span>
                    </div>
                    <div style={{color:'rgba(0, 0, 0, 0.54)'}}>
                        <div>
                            <span>NODE ID: </span>
                            <span>{ props.nodeAddresses.overlay ? props.nodeAddresses.overlay : '-' }</span>
                        </div>
                        <div>
                            <Typography variant="subtitle2" gutterBottom>
                                <span>AGENT: </span>
                                <a href='https://github.com/ethersphere/bee' target='_blank'>Bee</a>
                                <span>{props.nodeReadiness.version ? ` v${props.nodeReadiness.version}` : '-'}</span>
                                {props.beeRelease && props.beeRelease.name === `v${props.nodeReadiness.version?.split('-')[0]}` ?
                                    <Chip
                                    style={{ marginLeft: '7px', color: '#2145a0' }}
                                    size="small"
                                    label='latest'
                                    className={classes.status}
                                    />
                                :  
                                    props.loadingBeeRelease ?
                                    '' 
                                    :
                                    <a href='#'>update</a>
                                }
                            </Typography>
                        </div>
                    </div>
                    </CardContent>
                </div>
                :
                <div style={{padding: '16px'}}>
                    <Skeleton width={650} height={32} animation="wave" />
                    <Skeleton width={650} height={24} animation="wave" />
                    <Skeleton width={650} height={24} animation="wave" />
                </div>
                }
            </Card>
        </div>
    )
}

export default StatusCard
