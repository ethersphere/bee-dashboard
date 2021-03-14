import React, { useState } from 'react';
import { beeApi } from '../../services/bee';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Paper, InputBase, IconButton, Button, Container, CircularProgress, FormControlLabel, Switch } from '@material-ui/core';
import { Search, LinkSharp } from '@material-ui/icons';
import {DropzoneArea} from 'material-ui-dropzone'
import ClipboardCopy from '../../components/ClipboardCopy';

import TroubleshootConnectionCard from '../../components/TroubleshootConnectionCard';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
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

export default function Files(props: any) {
    const classes = useStyles();

    const [inputMode, setInputMode] = useState<'browse' | 'upload'>('browse');
    const [searchInput, setSearchInput] = useState('');
    const [searchResult, setSearchResult] = useState('');
    const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
    const [useSwarmGateway, setUseSwarmGateway] = useState<boolean>(false);
    const [pinningFile, setPinningFile] = useState<boolean>(false);

    const [files, setFiles] = useState<File[]>([]);
    const [uploadReference, setUploadReference] = useState('');
    const [uploadingFile, setUploadingFile] = useState<boolean>(false);

    const getCurrentApiHost = () => {
      let apiHost
  
      if (useSwarmGateway) {
        apiHost = process.env.REACT_APP_SWARM_GATEWAY_HOST
      } else if (sessionStorage.getItem('api_host')) {
        apiHost = String(sessionStorage.getItem('api_host') || '')
      } else {
        apiHost = process.env.REACT_APP_BEE_HOST
      }

      return apiHost
    }

    const getFile = () => {
      let apiHost = getCurrentApiHost()
      if (searchInput) {
        window.open(`${apiHost}/files/${searchInput}`, '_blank');
      }
    }

    const uploadFile = () => {
      setUploadingFile(true)
      console.log(files[0])
      if(files.length > 1) {
        beeApi.files.uploadFiles(files, useSwarmGateway)
        .then(hash => {
            setUploadReference(hash)
            setFiles([])
        })
        .catch(error => {
        })
        .finally(() => {
          setUploadingFile(false)
        })
      } else if (files.length === 1) {
        beeApi.files.uploadFile(files[0], useSwarmGateway)
        .then(hash => {
            setUploadReference(hash)
            setFiles([])
        })
        .catch(error => {
        })
        .finally(() => {
          setUploadingFile(false)
        })
      }
    }

    const pinFile = (hash: string) => {
      setPinningFile(true)
        beeApi.files.pinFile(hash)
        .then(res => {
        })
        .catch(error => {
        })
        .finally(() => {
          setPinningFile(false)
        })
    }

    const handleChange = (files: any) => {
      console.log(files)
      if (files.length > 0) {
        setFiles(files)
      }
    }

    return (
        <div>
            {props.nodeHealth?.status === 'ok' && props.health ?
            <Container maxWidth="md">
              <div style={{marginBottom: '7px'}}>
                <Button color="primary" style={{marginRight: '7px'}} onClick={() => setInputMode('browse')}>Browse</Button>
                <Button color="primary" onClick={() => setInputMode('upload')}>Upload</Button>
              </div>
              {inputMode === 'browse' ? 
              <div>
                <Paper component="form" onSubmit={(e) => {e.preventDefault(); getFile()}} className={classes.root}> 
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
                <FormControlLabel
                control={<Switch checked={useSwarmGateway} color="primary" onChange={() => setUseSwarmGateway(!useSwarmGateway)} />}
                label="Use Swarm Gateway"
                />
              </div>
              :
              <div>
                {uploadingFile ?
                <Container style={{textAlign:'center', padding:'50px'}}>
                    <CircularProgress />
                </Container> 
                :
                <div>
                  {uploadReference ?
                    <Paper component="form" className={classes.root}  style={{marginBottom:'15px', padding:'10px', paddingRight:'20px', display: 'flex', textAlign:'center'}}> 
                      <span>{uploadReference}</span>
                      <ClipboardCopy
                      value={`${getCurrentApiHost()}/files/${uploadReference}`}
                      icon={<LinkSharp />}
                      />
                      <ClipboardCopy
                      value={uploadReference}
                      icon={<div style={{padding:'5px'}}>#</div>}
                      />
                    </Paper>
                    :
                    null
                  }
                  <DropzoneArea
                  onChange={handleChange}
                  />
                  <div style={{marginTop:'15px'}}>
                    <FormControlLabel
                    control={<Switch checked={useSwarmGateway} color="primary" onChange={() => setUseSwarmGateway(!useSwarmGateway)} />}
                    label="Use Swarm Gateway"
                    />
                    <Button  style={{float:'right'}} variant='outlined' onClick={() => uploadFile()} className={classes.iconButton}>
                        Upload
                    </Button>
                  </div>
                </div>}
              </div>
              }
              {loadingSearch ?
              <Container style={{textAlign:'center', padding:'50px'}}>
                  <CircularProgress />
              </Container> 
              :
              <div style={{padding:'20px'}} >
              {searchResult}
              </div>
              }
            </Container>
            :
            props.isLoadingHealth || props.isLoadingNodeHealth ?
            <Container style={{textAlign:'center', padding:'50px'}}>
                <CircularProgress />
            </Container>
            :
            <TroubleshootConnectionCard
            />}
        </div>
    )
}
