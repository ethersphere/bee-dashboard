import type { ReactElement } from 'react'
import { Route, Switch } from 'react-router-dom'
import Accounting from './pages/accounting'
import Feeds from './pages/feeds'
import CreateNewFeed from './pages/feeds/CreateNewFeed'
import UpdateFeed from './pages/feeds/UpdateFeed'
import { Download } from './pages/files/Download'
import { Share } from './pages/files/Share'
import { Upload } from './pages/files/Upload'
import { UploadLander } from './pages/files/UploadLander'
import Info from './pages/info'
import Settings from './pages/settings'
import Stamps from './pages/stamps'
import Status from './pages/status'

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
  STATUS = '/status',
  FEEDS = '/feeds',
  FEEDS_NEW = '/feeds/new',
  FEEDS_UPDATE = '/feeds/update/:hash',
}

const BaseRouter = (): ReactElement => (
  <Switch>
    <Route exact path={ROUTES.UPLOAD_IN_PROGRESS} component={Upload} />
    <Route exact path={ROUTES.UPLOAD} component={UploadLander} />
    <Route exact path={ROUTES.DOWNLOAD} component={Download} />
    <Route exact path={ROUTES.HASH} component={Share} />
    <Route exact path={ROUTES.ACCOUNTING} component={Accounting} />
    <Route exact path={ROUTES.SETTINGS} component={Settings} />
    <Route exact path={ROUTES.STAMPS} component={Stamps} />
    <Route exact path={ROUTES.STATUS} component={Status} />
    <Route exact path={ROUTES.FEEDS} component={Feeds} />
    <Route exact path={ROUTES.FEEDS_NEW} component={CreateNewFeed} />
    <Route exact path={ROUTES.FEEDS_UPDATE} component={UpdateFeed} />
    <Route path={ROUTES.INFO} component={Info} />
  </Switch>
)

export default BaseRouter
