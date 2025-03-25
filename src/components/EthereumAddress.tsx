import { Typography } from '@material-ui/core/'
import { EthAddress } from '@ethersphere/bee-js'
import { ReactElement } from 'react'
import Identicon from 'react-identicons'
import { BLOCKCHAIN_EXPLORER_URL } from '../constants'
import ClipboardCopy from './ClipboardCopy'
import { Flex } from './Flex'
import QRCodeModal from './QRCodeModal'

interface Props {
  address: EthAddress | undefined
  hideBlockie?: boolean
  transaction?: boolean
  truncate?: boolean
}

export default function EthereumAddress(props: Props): ReactElement {
  return (
    <Typography component="div" variant="subtitle1">
      {props.address ? (
        <Flex>
          {props.hideBlockie ? null : (
            <div style={{ paddingTop: '5px', marginRight: '10px' }}>
              <Identicon size={20} string={props.address.toChecksum()} />
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
              href={`${BLOCKCHAIN_EXPLORER_URL}/${props.transaction ? 'tx' : 'address'}/${props.address}`}
              target="_blank"
              rel="noreferrer"
            >
              {props.address}
            </a>
          </div>
          <QRCodeModal value={props.address.toChecksum()} label={'Ethereum Address'} />
          <ClipboardCopy value={props.address.toChecksum()} />
        </Flex>
      ) : (
        '-'
      )}
    </Typography>
  )
}
