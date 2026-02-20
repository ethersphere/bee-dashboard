import { Wallet } from 'ethers'
import { createContext, ReactElement, useCallback, useContext, useEffect, useState } from 'react'

import { LocalStorageKeys } from '../utils/localStorage'

import { Context as SettingsContext } from './Settings'

interface ContextInterface {
  giftWallets: Wallet[]
  addGiftWallet: (wallet: Wallet) => void
}

const initialValues: ContextInterface = {
  giftWallets: [],
  addGiftWallet: () => {},
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactElement
}

export function Provider({ children }: Props): ReactElement {
  const [giftWallets, setGiftWallets] = useState(initialValues.giftWallets)
  const { rpcProvider } = useContext(SettingsContext)

  useEffect(() => {
    if (rpcProvider === null) return

    const existingGiftWallets = localStorage.getItem(LocalStorageKeys.giftWallets)

    if (existingGiftWallets) {
      setGiftWallets(JSON.parse(existingGiftWallets).map((privateKey: string) => new Wallet(privateKey, rpcProvider)))
    }
  }, [rpcProvider])

  const addGiftWallet = useCallback((wallet: Wallet) => {
    setGiftWallets(prev => {
      const newArray = [...prev, wallet]
      localStorage.setItem(LocalStorageKeys.giftWallets, JSON.stringify(newArray.map(x => x.privateKey)))

      return newArray
    })
  }, [])

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
