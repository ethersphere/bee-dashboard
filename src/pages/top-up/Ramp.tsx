import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { ReactElement, useEffect } from 'react'

interface Props {
  address?: string
}

export function Ramp({ address }: Props): ReactElement {
  useEffect(() => {
    const widget = new RampInstantSDK({
      hostAppName: 'Swarm',
      hostLogoUrl: 'https://avatars.githubusercontent.com/u/6946989?s=200&v=4',
      fiatValue: '10',
      fiatCurrency: 'EUR',
      userAddress: address,
      swapAsset: 'XDAI',
    })
    widget.show()

    if (widget.domNodes?.overlay) {
      widget.domNodes.overlay.style.zIndex = '10000000'
    }
  }, [address])

  return <div></div>
}
