import React, { useState } from 'react'
import { Link } from 'react-router-dom';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Chip, Button } from '@material-ui/core/';
import { CheckCircle, Error, ArrowRight, ArrowDropUp } from '@material-ui/icons/';
import { Skeleton } from '@material-ui/lab';
import type { NodeAddresses, Topology, Health } from '@ethersphere/bee-js';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      flex: '1 0 auto',

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

interface IProps{
    nodeHealth: Health,
    loadingNodeHealth: boolean,
    beeRelease: any,
    loadingBeeRelease: boolean,
    nodeAddresses: NodeAddresses,
    nodeTopology: Topology,
    loadingNodeTopology: boolean,
    setStatusChecksVisible: any,
}

function StatusCard(props: IProps) {
    const classes = useStyles();

    const [underlayAddressesVisible, setUnderlayAddresessVisible] = useState<Boolean>(false)

    return (
        <div>
            <Card className={classes.root}>
                { !props.loadingNodeHealth && props.nodeHealth ? 
                <div className={classes.details}>
                    <CardContent className={classes.content}>
                    <Typography component="h5" variant="h5" style={{display:'flex', justifyContent:'space-between'}}>
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
                        <Button variant='outlined' color='primary' size='small' style={{marginLeft:'12px'}} onClick={() => props.setStatusChecksVisible(true)}>View Status Checks</Button>
                    </Typography>
                    <div style={{marginBottom: '20px' }}>
                        <span style={{marginRight:'20px'}}>Discovered Nodes: { props.nodeTopology.population }</span>
                        <span style={{marginRight:'20px'}}>
                            <span>Connected Peers: </span>
                            <Link to='/peers/'>
                            { props.nodeTopology.connected }
                            </Link>
                        </span>
                    </div>
                    <div>
                        <Typography variant="subtitle2" gutterBottom>
                            <span>AGENT: </span>
                            <a href='https://github.com/ethersphere/bee' rel='noreferrer' target='_blank'>Bee</a>
                            <span>{props.nodeHealth?.version ? ` v${props.nodeHealth.version}` : '-'}</span>
                            {props.beeRelease && props.beeRelease.name === `v${props.nodeHealth?.version?.split('-')[0]}` ?
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
                        <Typography variant="subtitle2" gutterBottom>
                            <span>PUBLIC KEY: </span>
                            <span>{ props.nodeAddresses.public_key ? props.nodeAddresses.public_key : '-' }</span>
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                            <span>PSS PUBLIC KEY: </span>
                            <span>{ props.nodeAddresses.pss_public_key ? props.nodeAddresses.pss_public_key : '-' }</span>
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                                <Typography style={{marginTop:'20px'}}>
                                    <span>OVERLAY ADDRESS (PEER ID): </span>
                                    <span>{ props.nodeAddresses.overlay ? props.nodeAddresses.overlay : '-' }</span>
                                </Typography>
                                <Typography onClick={() => setUnderlayAddresessVisible(!underlayAddressesVisible)}>
                                    <Button color="primary" style={{padding: 0, marginTop:'6px'}}>
                                        { underlayAddressesVisible ? 
                                        <ArrowDropUp style={{fontSize:'12px'}} /> : 
                                        <ArrowRight style={{fontSize:'12px'}} />
                                        }
                                        <span>Underlay Addresses</span>
                                    </Button>
                                </Typography>
                                {underlayAddressesVisible ?
                                    <div>
                                    
                                    { props.nodeAddresses.underlay ? 
                                        props.nodeAddresses.underlay.map(item => (<li>{item}</li>)) 
                                    : '-' }
                                    </div>
                               : null}
                        </Typography>
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
