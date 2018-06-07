//client/routes.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import TestCreator from './components/TestCreator';
import TestDashboard from './components/TestDashboard';
import Test from './components/Test';
import DiscloseAgreement from './components/DiscloseAgreement';
import DemographicSurvey from './components/DemographicSurvey';
import Login from './components/Login'
import Debriefing from './components/Debriefing'
import NotFound from './components/NotFound'

//front end routing component

const Routes = () => (
	<div className='App'>
		<Switch>
			<Route exact path='/' component={DiscloseAgreement} />
			<Route exact path='/dashboard' component={TestDashboard} />
			<Route exact path='/test-creator' component={TestCreator} />
			<Route exact path='/test' component={Test} />
			<Route exact path='/demographic-survey' component={DemographicSurvey} />
			<Route exact path='/debriefing' component={Debriefing} />
			<Route exact path='/login' component={Login} />
			<Route component={NotFound} />
		</Switch>
	</div>
);

export default Routes;