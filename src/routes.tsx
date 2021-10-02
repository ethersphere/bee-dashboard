import type { ReactElement } from 'react'
import { Route, Switch } from 'react-router-dom'
import Accounting from './pages/accounting'
import Files from './pages/files'
import Info from './pages/info'
import Peers from './pages/peers'
import Settings from './pages/settings'
import Stamps from './pages/stamps'
import Status from './pages/status'

export enum ROUTES {
  INFO = '/',
  FILES = '/files',
  PEERS = '/peers',
  ACCOUNTING = '/accounting',
  SETTINGS = '/settings',
  STAMPS = '/stamps',
  STATUS = '/status',
}

const DEFAULT_COMPONENT = Info

const BaseRouter = (): ReactElement => (
  <Switch>
    <Route exact path={ROUTES.INFO} component={Info} />
    <Route exact path={ROUTES.FILES} component={Files} />
    <Route exact path={ROUTES.PEERS} component={Peers} />
    <Route exact path={ROUTES.ACCOUNTING} component={Accounting} />
    <Route exact path={ROUTES.SETTINGS} component={Settings} />
    <Route exact path={ROUTES.STAMPS} component={Stamps} />
    <Route exact path={ROUTES.STATUS} component={Status} />
    <Route component={DEFAULT_COMPONENT} />
  </Switch>
)

export default BaseRouter
