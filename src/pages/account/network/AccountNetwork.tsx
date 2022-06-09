import { ReactElement } from 'react'
import { AccountNavigation } from '../AccountNavigation'
import { Header } from '../Header'

export function AccountNetwork(): ReactElement {
  return (
    <>
      <Header />
      <AccountNavigation active="NETWORK" />
    </>
  )
}
