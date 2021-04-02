import type { ReactElement } from 'react'
import { Switch } from 'react-router-dom'

import AppRoute from './AppRoute'

// layouts
import Dashboard from '../layout/Dashboard'

// pages
import Status from '../pages/status/index'
import Files from '../pages/files/index'
import Peers from '../pages/peers/index'
import Accounting from '../pages/accounting/index'
import Settings from '../pages/settings/index'

const BaseRouter = (): ReactElement => (
  <Switch>
    <AppRoute exact path="/" layout={Dashboard} component={Status} />
    <AppRoute exact path="/files/" layout={Dashboard} component={Files} />
    <AppRoute exact path="/peers/" layout={Dashboard} component={Peers} />
    <AppRoute exact path="/accounting/" layout={Dashboard} component={Accounting} />
    <AppRoute exact path="/settings/" layout={Dashboard} component={Settings} />
  </Switch>
)

export default BaseRouter
