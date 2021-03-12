import React from 'react';
import { Typography } from '@material-ui/core/';
import { CheckCircle, Warning } from '@material-ui/icons/';
import CodeBlockTabs from '../../../components/CodeBlockTabs';

export default function VersionCheck(props: any) {
    return (
        <div>
            <p>Check to make sure the latest version of <a href='https://github.com/ethersphere/bee' rel='noreferrer' target='_blank'>Bee</a> is running</p>
            {props.beeRelease && props.beeRelease.name === `v${props.nodeReadiness?.version?.split('-')[0]}` ?
                <div>
                    <CheckCircle style={{color:'#32c48d', marginRight: '7px', height: '18px'}} />
                    <span>Your running the latest version of Bee</span>
                </div>
            :  
                props.loadingBeeRelease ?
                null 
                :
                <div>
                    <Warning style={{color:'#ff9800', marginRight: '7px', height: '18px'}} />
                    <span>Your Bee version is out of date. Please update to the <a href={props.beeRelease.html_url} rel='noreferrer' target='_blank'>latest</a> before continuing. Rerun the installation script below to upgrade. Reference the docs for help with updating. <a href='https://docs.ethswarm.org/docs/installation/manual#upgrading-bee' rel='noreferrer' target='_blank'>Docs</a></span>
                    <CodeBlockTabs
                    showLineNumbers
                    linux={`bee version\nwget https://github.com/ethersphere/bee/releases/download/${props.beeRelease.name}/bee_${props.nodeReadiness?.version?.split('-')[0]}_amd64.deb\nsudo dpkg -i bee_${props.nodeReadiness?.version?.split('-')[0]}_amd64.deb`}
                    mac={`bee version\nbrew tap ethersphere/tap\nbrew install swarm-bee\nbrew services start swarm-bee`}
                    />
                </div>
            }
            <div style={{display:'flex'}}>
                <div style={{marginRight:'30px'}}>
                <p><span>Current Version</span></p>
                <Typography component="h5" variant="h5">
                    <span>{props.nodeReadiness?.version ? ` v${props.nodeReadiness?.version?.split('-')[0]}` : '-'}</span>
                </Typography>
                </div>
                <div>
                <p><span>Latest Version</span></p>
                <Typography component="h5" variant="h5">
                    <span>{props.beeRelease && props.beeRelease.name ? props.beeRelease.name : '-'}</span>
                </Typography>
                </div>
            </div>
        </div>
    )
}
