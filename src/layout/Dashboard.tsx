import React, { FC } from 'react'

import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

import SideBar from '../components/SideBar';
import NavBar from '../components/NavBar';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: theme.mixins.toolbar,
    content: {
      marginLeft: '240px',
      marginTop: '64px',
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  }),
);

const Dashboard: FC = (props) => {
    const classes = useStyles();

    return (
        <div>
            <SideBar/>
            <NavBar />
            <main className={classes.content}>
                { props.children }
            </main>
        </div>
    )
}

export default Dashboard
