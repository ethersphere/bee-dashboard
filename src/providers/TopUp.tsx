import Wallet from 'ethereumjs-wallet'
import { createContext, ReactElement, useEffect, useState } from 'react'
import { Token } from '../models/Token'
import { setJsonRpcInDesktop } from '../utils/desktop'
import { generateWallet, getWalletFromPrivateKeyString } from '../utils/identity'
import { Rpc } from '../utils/rpc'

const LocalStorageKeys = {
  jsonRpcProvider: 'json-rpc-provider',
  depositWallet: 'deposit-wallet',
}

interface ContextInterface {
  jsonRpcProvider: string
  wallet: Wallet | null
  xDaiBalance: Token
  xBzzBalance: Token
  setJsonRpcProvider: (jsonRpcProvider: string) => void
}

const initialValues: ContextInterface = {
  jsonRpcProvider: '',
  xDaiBalance: new Token('0'),
  xBzzBalance: new Token('0'),
  wallet: null,
  setJsonRpcProvider: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactElement
}

export function Provider({ children }: Props): ReactElement {
  const [jsonRpcProvider, setJsonRpcProvider] = useState(
    localStorage.getItem('json-rpc-provider') || initialValues.jsonRpcProvider,
  )
  const [xDaiBalance, setXDaiBalance] = useState(initialValues.xDaiBalance)
  const [xBzzBalance, setXBzzBalance] = useState(initialValues.xBzzBalance)
  const [wallet, setWallet] = useState(initialValues.wallet)

  useEffect(() => {
    const existingWallet = localStorage.getItem(LocalStorageKeys.depositWallet)
    const wallet: Wallet = existingWallet ? getWalletFromPrivateKeyString(existingWallet) : generateWallet()
    localStorage.setItem(LocalStorageKeys.depositWallet, wallet.getPrivateKeyString())
    setWallet(wallet)
  }, [])

  function setAndPersistJsonRpcProvider(jsonRpcProvider: string) {
    localStorage.setItem(LocalStorageKeys.jsonRpcProvider, jsonRpcProvider)
    setJsonRpcProvider(jsonRpcProvider)
    // eslint-disable-next-line no-console
    setJsonRpcInDesktop(jsonRpcProvider).catch(console.error)
  }

  useEffect(() => {
    if (!wallet) {
      return
    }

    function refreshBalances() {
      if (!wallet) {
        return
      }
      Rpc._eth_getBalance(wallet.getAddressString()).then(balance => {
        setXDaiBalance(new Token(balance, 18))
      })
      Rpc._eth_getBalanceERC20(wallet.getAddressString()).then(balance => {
        setXBzzBalance(new Token(balance, 16))
      })
    }

    refreshBalances()
    const interval = setInterval(refreshBalances, 10_000)

    return () => {
      clearInterval(interval)
    }
  }, [wallet])

  return (
    <Context.Provider
      value={{
        jsonRpcProvider,
        xDaiBalance,
        xBzzBalance,
        wallet,
        setJsonRpcProvider: setAndPersistJsonRpcProvider,
      }}
    >
      {children}
    </Context.Provider>
  )
}
