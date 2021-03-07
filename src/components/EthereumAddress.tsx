import React from 'react';

import { Typography } from '@material-ui/core/';
import QRCodeModal from './QRCodeModal';
import ClipboardCopy from './ClipboardCopy';

// @ts-ignore
import Identicon from 'react-identicons';

interface IProps {
    address: string,
    network?: string,
}

export default function EthereumAddress(props: IProps) {
    return (
        <Typography component="p" variant="subtitle1">
            {props.address ? 
            <div style={{display:'flex'}}>
                <div style={{paddingTop:'5px'}}>
                    <Identicon size='20' string={props.address} />
                </div>
                <div>
                    <a 
                    style={{ marginLeft: '10px', marginRight:'7px',}}
                    href={`https://${props.network}.${process.env.REACT_APP_ETHERSCAN_HOST}/address/${props.address}`}
                    target='_blank'
                    >
                        { props.address }
                    </a>
                </div>
                <QRCodeModal
                value={ props.address }
                label={'Ethereum Address'}
                />
                <ClipboardCopy
                value={ props.address }
                />
            </div>
            : '-' }
        </Typography>
    )
}
