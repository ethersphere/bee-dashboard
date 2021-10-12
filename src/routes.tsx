import type { ReactElement } from 'react'
import { Switch } from 'react-router-dom'

import { Route } from 'react-router-dom'

import Info from './pages/info'
import Status from './pages/status'
import Files from './pages/files'
import Accounting from './pages/accounting'
import Settings from './pages/settings'
import Stamps from './pages/stamps'

export enum ROUTES {
  INFO = '/',
  FILES = '/files',
  ACCOUNTING = '/accounting',
  SETTINGS = '/settings',
  STAMPS = '/stamps',
  STATUS = '/status',
}

const BaseRouter = (): ReactElement => (
  <Switch>
    <Route exact path={ROUTES.FILES} component={Files} />
    <Route exact path={ROUTES.ACCOUNTING} component={Accounting} />
    <Route exact path={ROUTES.SETTINGS} component={Settings} />
    <Route exact path={ROUTES.STAMPS} component={Stamps} />
    <Route exact path={ROUTES.STATUS} component={Status} />
    <Route path={ROUTES.INFO} component={Info} />
  </Switch>
)

export default BaseRouter
