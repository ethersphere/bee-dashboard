import { Typography } from '@material-ui/core/'
import { ReactElement } from 'react'
import Identicon from 'react-identicons'
import { config } from '../config'
import ClipboardCopy from './ClipboardCopy'
import QRCodeModal from './QRCodeModal'

interface Props {
  address: string | undefined
  hideBlockie?: boolean
  transaction?: boolean
  truncate?: boolean
}

export default function EthereumAddress(props: Props): ReactElement {
  return (
    <Typography component="div" variant="subtitle1">
      {props.address ? (
        <div style={{ display: 'flex' }}>
          {props.hideBlockie ? null : (
            <div style={{ paddingTop: '5px', marginRight: '10px' }}>
              <Identicon size={20} string={props.address} />
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
              href={`${config.BLOCKCHAIN_EXPLORER_URL}/${props.transaction ? 'tx' : 'address'}/${props.address}`}
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
