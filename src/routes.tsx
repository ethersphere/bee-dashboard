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
import Info from './pages/info'
import Settings from './pages/settings'
import Stamps from './pages/stamps'
import { CreatePostageStampPage } from './pages/stamps/CreatePostageStampPage'
import Status from './pages/status'
import Upgrade from './pages/upgrade'

export enum ROUTES {
  INFO = '/',
  UPGRADE = '/upgrade',
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
}

const BaseRouter = (): ReactElement => (
  <Routes>
    <Route path={ROUTES.UPLOAD_IN_PROGRESS} element={<Upload />} />
    <Route path={ROUTES.UPLOAD} element={<UploadLander />} />
    <Route path={ROUTES.DOWNLOAD} element={<Download />} />
    <Route path={ROUTES.UPGRADE} element={<Upgrade />} />
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
  </Routes>
)

export default BaseRouter
