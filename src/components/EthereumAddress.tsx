import React from 'react'

import { Typography } from '@material-ui/core/'
import QRCodeModal from './QRCodeModal'
import ClipboardCopy from './ClipboardCopy'

// @ts-ignore
import Identicon from 'react-identicons'

interface IProps {
  address: string | undefined
  network?: string
  hideBlockie?: boolean
  transaction?: boolean
  truncate?: boolean
}

export default function EthereumAddress(props: IProps) {
  return (
    <Typography component="div" variant="subtitle1">
      {props.address ? (
        <div style={{ display: 'flex' }}>
          {props.hideBlockie ? null : (
            <div style={{ paddingTop: '5px', marginRight: '10px' }}>
              <Identicon size="20" string={props.address} />
            </div>
          )}
          <div>
            <a
              style={
                props.truncate
                  ? {
                      marginRight: '7px',
                      maxWidth: '200px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }
                  : { marginRight: '7px' }
              }
              href={`https://${props.network}.${process.env.REACT_APP_ETHERSCAN_HOST}/${
                props.transaction ? 'tx' : 'address'
              }/${props.address}`}
              target="_blank"
              rel="noreferrer"
            >
              {props.address}
            </a>
          </div>
          <QRCodeModal value={props.address} label={'Ethereum Address'} />
          <ClipboardCopy value={props.address} />
        </div>
      ) : (
        '-'
      )}
    </Typography>
  )
}
