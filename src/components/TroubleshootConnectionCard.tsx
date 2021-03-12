import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core/';

const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      marginTop: '20px'
    },
    title: {
      textAlign:'center',
      fontSize: 26,
    },
  });


export default function TroubleshootConnectionCard() {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} gutterBottom>
                    Looks like your node is not connected
                </Typography>
                <div style={{marginBottom:'20px', textAlign:'center'}}>
                <strong><Link to='/' >Click to run status checks</Link> on your nodes connection or check out the <a href={process.env.REACT_APP_BEE_DOCS_HOST} target='_blank' >Swarm Bee Docs</a></strong>
                </div>
            
                <div style={{marginBottom:'20px', textAlign:'center'}}>
                  <p style={{marginTop:'50px'}}>Still not working? Drop us a message on the Ethereum Swarm <a href={process.env.REACT_APP_BEE_DISCORD_HOST} target='_blank' >Discord</a></p>
                </div>
                
            </CardContent>
        </Card>
    )
}
