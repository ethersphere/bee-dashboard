import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'
import { getBeeEthereumAddress } from '../utils/desktop'
import { Rpc } from '../utils/rpc'

interface ContextInterface {
  bzz: string
  xdai: string
}

const initialValues: ContextInterface = {
  bzz: '0',
  xdai: '0',
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [bzz, setBzz] = useState<string>(initialValues.bzz)
  const [xdai, setXdai] = useState<string>(initialValues.xdai)

  const refresh = async () => {
    try {
      const address = await getBeeEthereumAddress()
      Rpc.eth_getBalance(address).then(balance => setXdai(balance))
      Rpc.eth_getBalanceERC20(address).then(balance => setBzz(balance))
    } catch (error) {
      console.error(error) // eslint-disable-line
    }
  }

  useEffect(() => {
    refresh()
    const interval = setInterval(refresh, 30_000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <Context.Provider value={{ bzz, xdai }}>{children}</Context.Provider>
}
