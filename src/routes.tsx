import type { ReactElement } from 'react'
import { Route, Routes } from 'react-router-dom'
import Accounting from './pages/accounting'
import Feeds from './pages/feeds'
import CreateNewFeed from './pages/feeds/CreateNewFeed'
import { FeedSubpage } from './pages/feeds/FeedSubpage'
import UpdateFeed from './pages/feeds/UpdateFeed'
import { Download } from './pages/files/Download'
import { Share } from './pages/files/Share'
import { Upload } from './pages/files/Upload'
import { UploadLander } from './pages/files/UploadLander'
import GiftCards from './pages/gift-code'
import Info from './pages/info'
import Wallet from './pages/rpc'
import Confirmation from './pages/rpc/Confirmation'
import Settings from './pages/settings'
import Stamps from './pages/stamps'
import { CreatePostageStampPage } from './pages/stamps/CreatePostageStampPage'
import Status from './pages/status'
import { BankCardTopUpIndex } from './pages/top-up/BankCardTopUpIndex'
import { CryptoTopUpIndex } from './pages/top-up/CryptoTopUpIndex'
import { Fund } from './pages/top-up/Fund'
import { GiftCardFund } from './pages/top-up/GiftCardFund'
import { GiftCardTopUpIndex } from './pages/top-up/GiftCardTopUpIndex'
import { Swap } from './pages/top-up/Swap'

export enum ROUTES {
  INFO = '/',
  FILES = '/files',
  UPLOAD = '/files/upload',
  UPLOAD_IN_PROGRESS = '/files/upload/workflow',
  DOWNLOAD = '/files/download',
  HASH = '/files/hash/:hash',
  ACCOUNTING = '/accounting',
  SETTINGS = '/settings',
  STAMPS = '/stamps',
  STAMPS_NEW = '/stamps/new',
  STATUS = '/status',
  FEEDS = '/feeds',
  FEEDS_NEW = '/feeds/new',
  FEEDS_UPDATE = '/feeds/update/:hash',
  FEEDS_PAGE = '/feeds/:uuid',
  WALLET = '/wallet',
  CONFIRMATION = '/wallet/confirmation',
  TOP_UP_CRYPTO = '/top-up/crypto',
  TOP_UP_CRYPTO_SWAP = '/top-up/crypto/swap',
  TOP_UP_CRYPTO_FUND = '/top-up/crypto/fund',
  TOP_UP_BANK_CARD = '/top-up/bank-card',
  TOP_UP_BANK_CARD_SWAP = '/top-up/bank-card/swap',
  TOP_UP_BANK_CARD_FUND = '/top-up/bank-card/fund',
  TOP_UP_GIFT_CODE = '/top-up/gift-code',
  TOP_UP_GIFT_CODE_FUND = '/top-up/gift-code/fund/:privateKeyString',
  GIFT_CODES = '/gift-codes',
}

const BaseRouter = (): ReactElement => (
  <Routes>
    <Route path={ROUTES.UPLOAD_IN_PROGRESS} element={<Upload />} />
    <Route path={ROUTES.UPLOAD} element={<UploadLander />} />
    <Route path={ROUTES.DOWNLOAD} element={<Download />} />
    <Route path={ROUTES.HASH} element={<Share />} />
    <Route path={ROUTES.ACCOUNTING} element={<Accounting />} />
    <Route path={ROUTES.SETTINGS} element={<Settings />} />
    <Route path={ROUTES.STAMPS} element={<Stamps />} />
    <Route path={ROUTES.STAMPS_NEW} element={<CreatePostageStampPage />} />
    <Route path={ROUTES.STATUS} element={<Status />} />
    <Route path={ROUTES.FEEDS} element={<Feeds />} />
    <Route path={ROUTES.FEEDS_NEW} element={<CreateNewFeed />} />
    <Route path={ROUTES.FEEDS_UPDATE} element={<UpdateFeed />} />
    <Route path={ROUTES.FEEDS_PAGE} element={<FeedSubpage />} />
    <Route path={ROUTES.INFO} element={<Info />} />
    <Route path={ROUTES.WALLET} element={<Wallet />} />
    <Route path={ROUTES.CONFIRMATION} element={<Confirmation />} />
    <Route path={ROUTES.GIFT_CODES} element={<GiftCards />} />
    <Route path={ROUTES.TOP_UP_CRYPTO} element={<CryptoTopUpIndex />} />
    <Route
      path={ROUTES.TOP_UP_CRYPTO_SWAP}
      element={<Swap header="Top-up with cryptocurrencies" next={ROUTES.TOP_UP_CRYPTO_FUND} />}
    />
    <Route path={ROUTES.TOP_UP_CRYPTO_FUND} element={<Fund header="Top-up with cryptocurrencies" />} />
    <Route path={ROUTES.TOP_UP_BANK_CARD} element={<BankCardTopUpIndex />} />
    <Route
      path={ROUTES.TOP_UP_BANK_CARD_SWAP}
      element={<Swap header="Top-up with bank card" next={ROUTES.TOP_UP_BANK_CARD_FUND} />}
    />
    <Route path={ROUTES.TOP_UP_BANK_CARD_FUND} element={<Fund header="Top-up with bank card" />} />
    <Route path={ROUTES.TOP_UP_GIFT_CODE} element={<GiftCardTopUpIndex />} />
    <Route path={ROUTES.TOP_UP_GIFT_CODE_FUND} element={<GiftCardFund />} />
  </Routes>
)

export default BaseRouter
