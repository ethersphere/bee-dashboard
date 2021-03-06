import React from 'react'

import { makeStyles, } from '@material-ui/core/styles';
import { Card, CardContent, Typography } from '@material-ui/core/';
import CodeBlock from './CodeBlock';

const useStyles = makeStyles({
    root: {
      flexGrow: 1,
      marginTop: '20px'
    },
    title: {
      textAlign:'center',
      fontSize: 16,
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
                <strong>Check out the installation guide in the <a href={process.env.REACT_APP_BEE_DOCS_HOST} target='_blank' >Swarm Bee Docs</a>, or try the following common fixes:</strong>
                </div>
                <Typography variant="h5" component="h3">
                1. Restart your bee node 
                </Typography>
                <CodeBlock
                showLineNumbers
                language='bash'
                code={
                `sudo systemctl status bee \nsudo systemctl start bee\njournalctl --lines=100 --follow --unit bee`}
                />
                <Typography variant="h5" component="h3">
                2. Check your nodes configuration file
                </Typography>
                <p>Check if you started your node with different ports or disabled your nodes debug api</p>
                <CodeBlock
                showLineNumbers
                language='bash'
                code={
                `more /home/<user>/bee-config.yaml`}
                />
                <Typography variant="h5" component="h3">
                3. Check your firewall settings
                </Typography>
                <p>Your nodes API must be enabled and the debug api should be turned on and bound to localhost</p>
                <div style={{marginBottom:'20px', textAlign:'center'}}>
                  <p style={{marginTop:'50px'}}>Still not working? Drop us a message on the Ethereum Swarm <a href={process.env.REACT_APP_BEE_DISCORD_HOST} target='_blank' >Discord</a></p>
                </div>
                
            </CardContent>
        </Card>
    )
}
