import type { ReactElement } from 'react'
import { Switch } from 'react-router-dom'

import { Route } from 'react-router-dom'

import Info from '../pages/info'
import Status from '../pages/status'
import Files from '../pages/files'
import Peers from '../pages/peers'
import Accounting from '../pages/accounting'
import Settings from '../pages/settings'
import Stamps from '../pages/stamps'

const BaseRouter = (): ReactElement => (
  <Switch>
    <Route exact path="/" component={Info} />
    <Route exact path="/files/" component={Files} />
    <Route exact path="/peers/" component={Peers} />
    <Route exact path="/accounting/" component={Accounting} />
    <Route exact path="/settings/" component={Settings} />
    <Route exact path="/stamps/" component={Stamps} />
    <Route exact path="/status" component={Status} />
  </Switch>
)

export default BaseRouter
