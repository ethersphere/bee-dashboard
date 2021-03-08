import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Chip, IconButton } from '@material-ui/core/';

import { Sun, Moon } from 'react-feather';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      background:'linear-gradient(35deg,#fb6340,#fbb140)!important'
    },
    network: {

    }
  }),
);


export default function SideBar(props: any) {
  const [darkMode, toggleDarkMode] = useState(false);

  const switchTheme = () => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light')
    toggleDarkMode(!darkMode)
  }

  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar style={{display: 'flex'}}>
          <Chip
          style={{ marginLeft: '7px'}}
          size="small"
          label='Goerli'
          className={classes.network}
          />
          <div style={{width:'100%'}}>
            <div style={{float:'right'}} >
              <IconButton style={{marginRight:'10px'}} aria-label="dark-mode" onClick={() => switchTheme()}>
                {props.themeMode === 'dark' ?
                <Moon />
                :
                <Sun />
                }
              </IconButton>
              {/* <Chip 
              label="Connect Wallet"
              color="primary"
              /> */}
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}
