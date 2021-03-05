import React from 'react';
import { Link } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor:'#dd7200'
    },
  }),
);

export default function SideBar() {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Bee
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
