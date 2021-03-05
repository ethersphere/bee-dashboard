import React from 'react';
import { Link } from 'react-router-dom';

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { OpenInNewSharp } from '@material-ui/icons';
import Icon from '@material-ui/core/Icon';

import SwarmLogo from '../assets/swarm-logo-1.svg';

const drawerWidth = 240;

const navBarItems = [
    {
        'label': 'Status',
        'id': 'status',
        'path': '/status/',
        'icon': 'poll_sharp'
    },
    {
        'label': 'Files',
        'id': 'files',
        'path': '/files/',
        'icon': 'storage_sharp'
    },
    {
        'label': 'Settings',
        'id': 'settings',
        'path': '/settings/',
        'icon': 'settings_sharp'
    }  
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      backgroundColor:'#dd7200'
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: theme.mixins.toolbar,
  }),
);


export default function SideBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar} style={{ textAlign:'center' }}>
            <Link to='/'>
                <img src={SwarmLogo} style={{maxHeight: '42px', alignItems:'center', marginTop:'10px'}} /> 
            </Link>
        </div>
        <Divider />
        <List>
            {navBarItems.map(item => (
                <Link to={item.path} style={{ color:'inherit', textDecoration:'none'}}>
                    <ListItem button key={item.id}>
                        <ListItemIcon>
                            <Icon>{ item.icon }</Icon>
                        </ListItemIcon>
                        <ListItemText primary={item.label} />
                    </ListItem>
                </Link>
            ))}
        </List>
        <Divider />
        <List>
            <a href={process.env.REACT_APP_BEE_DOCS_HOST} target="_blank" >
                <ListItem button key={'Status'}>
                    <ListItemText primary={'Docs'} />
                    <OpenInNewSharp fontSize="small" />
                </ListItem>
            </a>
        </List>
      </Drawer>
    </div>
  );
}
