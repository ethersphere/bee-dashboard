import Wallet from 'ethereumjs-wallet'
import { createContext, ReactElement, useEffect, useState } from 'react'
import { setJsonRpcInDesktop } from '../utils/desktop'
import { generateWallet, getWalletFromPrivateKeyString } from '../utils/identity'
import { ResolvedWallet } from '../utils/wallet'

const LocalStorageKeys = {
  jsonRpcProvider: 'json-rpc-provider',
  depositWallet: 'deposit-wallet',
  giftWallets: 'gift-wallets',
  invitation: 'invitation',
}

interface ContextInterface {
  jsonRpcProvider: string
  wallet: ResolvedWallet | null
  giftWallets: Wallet[]
  setJsonRpcProvider: (jsonRpcProvider: string) => void
  addGiftWallet: (wallet: Wallet) => void
}

const initialValues: ContextInterface = {
  jsonRpcProvider: '',
  wallet: null,
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
  const [wallet, setWallet] = useState(initialValues.wallet)
  const [giftWallets, setGiftWallets] = useState(initialValues.giftWallets)

  useEffect(() => {
    const existingWallet = localStorage.getItem(LocalStorageKeys.depositWallet)
    const wallet: Wallet = existingWallet ? getWalletFromPrivateKeyString(existingWallet) : generateWallet()
    localStorage.setItem(LocalStorageKeys.depositWallet, wallet.getPrivateKeyString())
    ResolvedWallet.make(wallet).then(setWallet)
  }, [])

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

  useEffect(() => {
    if (!wallet) {
      return
    }

    const timeout = setTimeout(wallet.refresh.bind(wallet), 30_000)

    return () => {
      clearTimeout(timeout)
    }
  }, [wallet])

  return (
    <Context.Provider
      value={{
        jsonRpcProvider,
        wallet,
        giftWallets,
        setJsonRpcProvider: setAndPersistJsonRpcProvider,
        addGiftWallet,
      }}
    >
      {children}
    </Context.Provider>
  )
}
