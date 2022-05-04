import { createStyles, makeStyles } from '@material-ui/core'
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { ReactElement, useEffect, useRef } from 'react'

const useStyles = makeStyles(() =>
  createStyles({
    containerNode: {
      height: '0px',
    },
  }),
)

interface Props {
  address?: string
}

export function Ramp({ address }: Props): ReactElement {
  const ref = useRef(null)
  const styles = useStyles()

  useEffect(() => {
    if (!ref.current || !address) {
      return
    }
    const widget = new RampInstantSDK({
      hostAppName: 'Swarm',
      hostLogoUrl: 'https://avatars.githubusercontent.com/u/6946989?s=200&v=4',
      //   variant: 'embedded-mobile',
      //   containerNode: ref.current,
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

  return <div ref={ref} className={styles.containerNode}></div>
}
