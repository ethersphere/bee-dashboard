import { Wallet } from 'ethers'
import { createContext, ReactElement, useContext, useEffect, useState } from 'react'
import { Context as SettingsContext } from './Settings'

const LocalStorageKeys = {
  depositWallet: 'deposit-wallet',
  giftWallets: 'gift-wallets',
  invitation: 'invitation',
}

interface ContextInterface {
  giftWallets: Wallet[]
  addGiftWallet: (wallet: Wallet) => void
}

const initialValues: ContextInterface = {
  giftWallets: [],
  addGiftWallet: () => {}, // eslint-disable-line
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactElement
}

export function Provider({ children }: Props): ReactElement {
  const [giftWallets, setGiftWallets] = useState(initialValues.giftWallets)
  const { provider } = useContext(SettingsContext)

  useEffect(() => {
    if (provider === null) return

    const existingGiftWallets = localStorage.getItem(LocalStorageKeys.giftWallets)

    if (existingGiftWallets) {
      setGiftWallets(JSON.parse(existingGiftWallets).map((privateKey: string) => new Wallet(privateKey, provider)))
    }
  }, [provider])

  function addGiftWallet(wallet: Wallet) {
    const newArray = [...giftWallets, wallet]
    localStorage.setItem(LocalStorageKeys.giftWallets, JSON.stringify(newArray.map(x => x.privateKey)))
    setGiftWallets(newArray)
  }

  return (
    <Context.Provider
      value={{
        giftWallets,
        addGiftWallet,
      }}
    >
      {children}
    </Context.Provider>
  )
}
