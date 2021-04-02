import React, { useContext } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';

import { useApiHealth, useDebugApiHealth } from '../hooks/apiHooks';
import AppThemeProvider from '../providers/Theme'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      marginLeft: '240px',
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

    const { health, isLoadingHealth } = useApiHealth()
    const { nodeHealth, isLoadingNodeHealth } = useDebugApiHealth()
    const { themeMode, toggleThemeMode } = useContext(AppThemeProvider.Context)

    let childrenInjectedWithProps = React.cloneElement(props.children, { health, nodeHealth, isLoadingHealth, isLoadingNodeHealth })

    return (
      <>
        <SideBar {...props} themeMode={themeMode} health={health} nodeHealth={nodeHealth} />
        <NavBar themeMode={themeMode} toggleThemeMode={toggleThemeMode} />
        <main className={classes.content} >
            {childrenInjectedWithProps}
        </main>
      </>
    )
}

export default Dashboard
