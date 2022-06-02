import Wallet from 'ethereumjs-wallet'
import { createContext, ReactElement, useEffect, useState } from 'react'
import { setJsonRpcInDesktop } from '../utils/desktop'
import { getWalletFromPrivateKeyString } from '../utils/identity'

const LocalStorageKeys = {
  jsonRpcProvider: 'json-rpc-provider',
  depositWallet: 'deposit-wallet',
  giftWallets: 'gift-wallets',
  invitation: 'invitation',
}

interface ContextInterface {
  jsonRpcProvider: string
  giftWallets: Wallet[]
  setJsonRpcProvider: (jsonRpcProvider: string) => void
  addGiftWallet: (wallet: Wallet) => void
}

const initialValues: ContextInterface = {
  jsonRpcProvider: '',
  giftWallets: [],
  setJsonRpcProvider: () => {}, // eslint-disable-line
  addGiftWallet: () => {}, // eslint-disable-line
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
  const [giftWallets, setGiftWallets] = useState(initialValues.giftWallets)

  useEffect(() => {
    const existingGiftWallets = localStorage.getItem(LocalStorageKeys.giftWallets)

    if (existingGiftWallets) {
      setGiftWallets(JSON.parse(existingGiftWallets).map(getWalletFromPrivateKeyString))
    }
  }, [])

  function setAndPersistJsonRpcProvider(jsonRpcProvider: string) {
    localStorage.setItem(LocalStorageKeys.jsonRpcProvider, jsonRpcProvider)
    setJsonRpcProvider(jsonRpcProvider)
    // eslint-disable-next-line no-console
    setJsonRpcInDesktop(jsonRpcProvider).catch(console.error)
  }

  function addGiftWallet(wallet: Wallet) {
    const newArray = [...giftWallets, wallet]
    localStorage.setItem(LocalStorageKeys.giftWallets, JSON.stringify(newArray.map(x => x.getPrivateKeyString())))
    setGiftWallets(newArray)
  }

  return (
    <Context.Provider
      value={{
        jsonRpcProvider,
        giftWallets,
        setJsonRpcProvider: setAndPersistJsonRpcProvider,
        addGiftWallet,
      }}
    >
      {children}
    </Context.Provider>
  )
}
