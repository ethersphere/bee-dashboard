import React from 'react'

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
        color: '#fff',
        backgroundColor: '#76a9fa',
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

interface IProps{
    nodeHealth: NodeHealth,
    loadingNodeHealth: boolean,
    nodeReadiness: NodeReadiness,
    loadingNodeReadiness: boolean,
    nodeAddresses: NodeAddresses,
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
                        { props.nodeReadiness.status === 'ok' ? 
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
                    <Typography color="textSecondary" component='p'>
                        <div>
                            <span>NODE ID: </span>
                            <span>{ props.nodeAddresses.overlay }</span>
                        </div>
                        <div>
                            <span>AGENT: </span>
                            <a href='https://github.com/ethersphere/bee' target='_blank'>Bee </a>
                            <span>v{ props.nodeReadiness.version }</span>
                            {'latest' ?
                            <Chip
                            style={{ marginLeft: '7px'}}
                            size="small"
                            label='latest'
                            className={classes.status}
                            />
                            :  
                            <a href='#'>update</a>
                            }
                        </div>
                    </Typography>
                    </CardContent>
                </div>
                :
                <div>
                    <Skeleton animation="wave" />
                </div>
                }
            </Card>
        </div>
    )
}

export default StatusCard
