import React, { FC, useState, useEffect } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

import { useApiHealth, useDebugApiHealth } from '../hooks/apiHooks';


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


const Dashboard = (props: any) => {
    const classes = useStyles();

    const [themeMode, toggleThemeMode] = useState('light');

    const { health } = useApiHealth()
    const { nodeHealth } = useDebugApiHealth()

    useEffect(() => {
      let theme = localStorage.getItem('theme')

      if (theme) {
        toggleThemeMode(String(localStorage.getItem('theme')))
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        toggleThemeMode('dark')
      }
  
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        toggleThemeMode(e.matches ? "dark" : "light")
      });

      return () => window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', e => {
        toggleThemeMode(e.matches ? "dark" : "light")
      })
    }, [])

    let childrenInjectedWithProps = React.cloneElement(props.children, { health, nodeHealth })

    return (
        <div>
            <SideBar {...props} themeMode={themeMode} health={health} nodeHealth={nodeHealth} />
            <NavBar themeMode={themeMode} />
            <main className={classes.content} >
                {childrenInjectedWithProps}
            </main>
        </div>
    )
}

export default Dashboard
