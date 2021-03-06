import React from 'react';
import { Link } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { AppBar, Toolbar, Typography, Chip } from '@material-ui/core/';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor:'#dd7200'
    },
    network: {

    }
  }),
);

export default function SideBar() {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{display: 'flex'}}>
          <Typography variant="h6">
            Bee
          </Typography>
          <Chip
          style={{ marginLeft: '7px'}}
          size="small"
          label='Goerli'
          className={classes.network}
          />
          <div style={{width:'100%'}}>
            <Chip style={{float:'right'}} label="Connect Wallet" />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
