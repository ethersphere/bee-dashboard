import React, { FC, useState, useEffect } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

import SwarmLogo from '../assets/swarm-logo-3.png'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      marginLeft: '240px',
      marginTop: '64px',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
      paddingBottom:'65px',
    },
    footer: {
      marginLeft: '240px',
      backgroundColor: theme.palette.background.default,
      position: 'fixed',
      bottom: 0,
      flexGrow: 1,
      width:'-webkit-fill-available',
      padding: theme.spacing(2),
      textAlign:'center'
    },
    logo: {
      height: '20px',
      marginRight: '7px',
    }
  }),
);

const Dashboard: FC = (props) => {
    const classes = useStyles();

    const [themeMode, toggleThemeMode] = useState('light');

    useEffect(() => {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleThemeMode('dark')
      }
  
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        toggleThemeMode(e.matches ? "dark" : "light")
      });
    }, [])

    return (
        <div>
            <SideBar {...props} themeMode={themeMode} />
            <NavBar  themeMode={themeMode} />
            <main className={classes.content}>
                { props.children }
            </main>
            <footer className={classes.footer}>
              <div style={{display:'inline-flex'}}>
                <img src={SwarmLogo} className={classes.logo} />
                <div>Ethereum Swarm</div>
              </div>
            </footer>
        </div>
    )
}

export default Dashboard
