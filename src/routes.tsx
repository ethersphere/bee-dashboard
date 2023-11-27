import { ReactElement, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AccountChequebook } from './pages/account/chequebook/AccountChequebook'
import { AccountFeeds } from './pages/account/feeds/AccountFeeds'
import { AccountStaking } from './pages/account/staking/AccountStaking'
import { AccountStamps } from './pages/account/stamps/AccountStamps'
import { AccountWallet } from './pages/account/wallet/AccountWallet'
import CreateNewFeed from './pages/feeds/CreateNewFeed'
import { FeedSubpage } from './pages/feeds/FeedSubpage'
import UpdateFeed from './pages/feeds/UpdateFeed'
import { Download } from './pages/files/Download'
import { Share } from './pages/files/Share'
import { Upload } from './pages/files/Upload'
import { UploadLander } from './pages/files/UploadLander'
import GiftCards from './pages/gift-code'
import Info from './pages/info'
import LightModeRestart from './pages/restart/LightModeRestart'
import Settings from './pages/settings'
import { CreatePostageStampPage } from './pages/stamps/CreatePostageStampAdvancedPage'
import Status from './pages/status'
import TopUp from './pages/top-up'
import { BankCardTopUpIndex } from './pages/top-up/BankCardTopUpIndex'
import { CryptoTopUpIndex } from './pages/top-up/CryptoTopUpIndex'
import { GiftCardFund } from './pages/top-up/GiftCardFund'
import { GiftCardTopUpIndex } from './pages/top-up/GiftCardTopUpIndex'
import { Swap } from './pages/top-up/Swap'
import { Context as SettingsContext } from './providers/Settings'
import { CreatePostageStampBasicPage } from './pages/stamps/CreatePostageStampStandardPage'

export enum ROUTES {
  INFO = '/',
  FILES = '/files',
  UPLOAD = '/files/upload',
  UPLOAD_IN_PROGRESS = '/files/upload/workflow',
  DOWNLOAD = '/files/download',
  HASH = '/files/hash/:hash',
  SETTINGS = '/settings',
  STATUS = '/status',
  TOP_UP = '/account/wallet/top-up',
  TOP_UP_CRYPTO = '/account/wallet/top-up/crypto',
  TOP_UP_CRYPTO_SWAP = '/account/wallet/top-up/crypto/swap',
  TOP_UP_BANK_CARD = '/account/wallet/top-up/bank-card',
  TOP_UP_BANK_CARD_SWAP = '/account/wallet/top-up/bank-card/swap',
  TOP_UP_GIFT_CODE = '/account/wallet/top-up/gift-code',
  TOP_UP_GIFT_CODE_FUND = '/account/wallet/top-up/gift-code/fund/:privateKeyString',
  RESTART_LIGHT = '/light-mode-restart',
  ACCOUNT_WALLET = '/account/wallet',
  ACCOUNT_CHEQUEBOOK = '/account/chequebook',
  ACCOUNT_STAMPS = '/account/stamps',
  ACCOUNT_STAMPS_NEW_STANDARD = '/account/stamps/new',
  ACCOUNT_STAMPS_NEW_ADVANCED = '/account/stamps/new/advanced',
  ACCOUNT_FEEDS = '/account/feeds',
  ACCOUNT_FEEDS_NEW = '/account/feeds/new',
  ACCOUNT_FEEDS_UPDATE = '/account/feeds/update/:hash',
  ACCOUNT_FEEDS_VIEW = '/account/feeds/:uuid',
  ACCOUNT_INVITATIONS = '/account/invitations',
  ACCOUNT_STAKING = '/account/staking',
}

export const ACCOUNT_TABS = [
  ROUTES.ACCOUNT_WALLET,
  ROUTES.ACCOUNT_CHEQUEBOOK,
  ROUTES.ACCOUNT_STAMPS,
  ROUTES.ACCOUNT_FEEDS,
  ROUTES.ACCOUNT_STAKING,
]

const BaseRouter = (): ReactElement => {
  const { isDesktop } = useContext(SettingsContext)

  return (
    <Routes>
      <Route path={ROUTES.UPLOAD_IN_PROGRESS} element={<Upload />} />
      <Route path={ROUTES.UPLOAD} element={<UploadLander />} />
      <Route path={ROUTES.DOWNLOAD} element={<Download />} />
      <Route path={ROUTES.HASH} element={<Share />} />
      <Route path={ROUTES.SETTINGS} element={<Settings />} />
      <Route path={ROUTES.STATUS} element={<Status />} />
      <Route path={ROUTES.INFO} element={<Info />} />
      <Route path={ROUTES.TOP_UP} element={<TopUp />} />
      <Route path={ROUTES.TOP_UP_CRYPTO} element={<CryptoTopUpIndex />} />
      <Route path={ROUTES.TOP_UP_CRYPTO_SWAP} element={<Swap header="Top-up with cryptocurrencies" />} />
      <Route path={ROUTES.TOP_UP_BANK_CARD} element={<BankCardTopUpIndex />} />
      <Route path={ROUTES.TOP_UP_BANK_CARD_SWAP} element={<Swap header="Top-up with bank card" />} />
      <Route path={ROUTES.TOP_UP_GIFT_CODE} element={<GiftCardTopUpIndex />} />
      <Route path={ROUTES.TOP_UP_GIFT_CODE_FUND} element={<GiftCardFund />} />
      <Route path={ROUTES.RESTART_LIGHT} element={<LightModeRestart />} />
      <Route path={ROUTES.ACCOUNT_WALLET} element={<AccountWallet />} />
      <Route path={ROUTES.ACCOUNT_CHEQUEBOOK} element={<AccountChequebook />} />
      <Route path={ROUTES.ACCOUNT_STAMPS} element={<AccountStamps />} />
      <Route path={ROUTES.ACCOUNT_STAMPS_NEW_STANDARD} element={<CreatePostageStampBasicPage />} />
      <Route path={ROUTES.ACCOUNT_STAMPS_NEW_ADVANCED} element={<CreatePostageStampPage />} />
      <Route path={ROUTES.ACCOUNT_FEEDS} element={<AccountFeeds />} />
      <Route path={ROUTES.ACCOUNT_FEEDS_NEW} element={<CreateNewFeed />} />
      <Route path={ROUTES.ACCOUNT_FEEDS_UPDATE} element={<UpdateFeed />} />
      <Route path={ROUTES.ACCOUNT_FEEDS_VIEW} element={<FeedSubpage />} />
      <Route path={ROUTES.ACCOUNT_STAKING} element={<AccountStaking />} />
      {isDesktop && <Route path={ROUTES.ACCOUNT_INVITATIONS} element={<GiftCards />} />}
    </Routes>
  )
}

export default BaseRouter
