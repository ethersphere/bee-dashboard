import React from 'react';
import { Switch } from 'react-router-dom';

import AppRoute from './AppRoute';

// layouts
import Dashboard from '../layout/Dashboard';

// pages
import Status from '../pages/status/index';
import Settings from '../pages/settings/index';


const BaseRouter = () => (
    <Switch>
        <AppRoute exact path='/' layout={ Dashboard } component={Status}/>
        <AppRoute exact path='/status/' layout={ Dashboard } component={Status}/>
        <AppRoute exact path='/settings/' layout={ Dashboard } component={Settings}/>
    </Switch>
);

export default BaseRouter;