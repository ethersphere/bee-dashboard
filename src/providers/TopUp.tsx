import { providers, Wallet } from 'ethers'
import { createContext, ReactElement, useEffect, useState } from 'react'
import config from '../config'
import { setJsonRpcInDesktop } from '../utils/desktop'

const LocalStorageKeys = {
  providerUrl: 'json-rpc-provider',
  depositWallet: 'deposit-wallet',
  giftWallets: 'gift-wallets',
  invitation: 'invitation',
}

interface ContextInterface {
  providerUrl: string
  provider: providers.JsonRpcProvider
  giftWallets: Wallet[]
  setProviderUrl: (providerUrl: string) => void
  addGiftWallet: (wallet: Wallet) => void
}

const providerUrl = localStorage.getItem('json-rpc-provider') || config.DEFAULT_RPC_URL

const initialValues: ContextInterface = {
  providerUrl,
  provider: new providers.JsonRpcProvider(providerUrl),
  giftWallets: [],
  setProviderUrl: () => {}, // eslint-disable-line
  addGiftWallet: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactElement
}

export function Provider({ children }: Props): ReactElement {
  const [providerUrl, setProviderUrl] = useState(initialValues.providerUrl)
  const [provider, setProvider] = useState(initialValues.provider)
  const [giftWallets, setGiftWallets] = useState(initialValues.giftWallets)

  useEffect(() => {
    if (provider === null) return

    const existingGiftWallets = localStorage.getItem(LocalStorageKeys.giftWallets)

    if (existingGiftWallets) {
      setGiftWallets(JSON.parse(existingGiftWallets).map((privateKey: string) => new Wallet(privateKey, provider)))
    }
  }, [provider])

  function setAndPersistJsonRpcProvider(providerUrl: string) {
    localStorage.setItem(LocalStorageKeys.providerUrl, providerUrl)
    setProviderUrl(providerUrl)
    setProvider(new providers.JsonRpcProvider(providerUrl))
    // eslint-disable-next-line no-console
    setJsonRpcInDesktop(providerUrl).catch(console.error)
  }

  function addGiftWallet(wallet: Wallet) {
    const newArray = [...giftWallets, wallet]
    localStorage.setItem(LocalStorageKeys.giftWallets, JSON.stringify(newArray.map(x => x.privateKey)))
    setGiftWallets(newArray)
  }

  return (
    <Context.Provider
      value={{
        providerUrl,
        provider,
        giftWallets,
        setProviderUrl: setAndPersistJsonRpcProvider,
        addGiftWallet,
      }}
    >
      {children}
    </Context.Provider>
  )
}
