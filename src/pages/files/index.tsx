import React, { useState } from 'react';
import { beeApi } from '../../services/bee';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper, InputBase, IconButton, Button, Container, CircularProgress } from '@material-ui/core';
import { Search } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export default function Files() {
    const classes = useStyles();

    const [inputMode, setInputMode] = useState('browse');
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [loadingSearch, setLoadingSearch] = useState(false);

    const getFile = () => {
      setLoadingSearch(true)
        beeApi.files.downloadFile(searchInput)
        .then(res => {
            setSearchResult(new TextDecoder("utf-8").decode(res.data))
        })
        .catch(error => {
        })
        .finally(() => {
          setLoadingSearch(false)
        })
    }

    return (
        <div>
            <Container maxWidth="sm">
            <div style={{marginBottom: '7px'}}>
              <Button color="primary" style={{marginRight: '7px'}} onClick={() => setInputMode('browse')}>Browse</Button>
              <Button color="primary" onClick={() => setInputMode('upload')}>Upload</Button>
            </div>
            {inputMode === 'browse' ? 
            <Paper component="form" className={classes.root}> 
                <InputBase
                className={classes.input}
                placeholder="Enter hash e.g. 0773a91efd6547c754fc1d95fb1c62c7d1b47f959c2caa685dfec8736da95c1c"
                inputProps={{ 'aria-label': 'search swarm nodes' }}
                onChange={(e) => setSearchInput(e.target.value)}
                />
                <IconButton onClick={() => getFile()} className={classes.iconButton} aria-label="search">
                    <Search />
                </IconButton>
            </Paper>
            :
            <Paper component="form" className={classes.root}> 
                <InputBase
                className={classes.input}
                placeholder="Enter file name"
                inputProps={{ 'aria-label': 'upload swarm nodes' }}
                onChange={(e) => setSearchInput(e.target.value)}
                />
                <IconButton onClick={() => getFile()} className={classes.iconButton} aria-label="search">
                    <Search />
                </IconButton>
            </Paper>
            }
            {loadingSearch ?
            <Container style={{textAlign:'center', padding:'50px'}}>
                <CircularProgress />
            </Container> : searchResult
            }
            </Container>
        </div>
    )
}
