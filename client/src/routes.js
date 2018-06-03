//client/routes.js
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import TestCreator from './components/TestCreator';
import TestDashboard from './components/TestDashboard';
//import TestViewer from './components/TestViewer';
import Test from './components/Test';
import DiscloseAgreement from './components/DiscloseAgreement';
import DemographicSurvey from './components/DemographicSurvey';
import Login from './components/Login'
import Debriefing from './components/Debriefing'
import NotFound from './components/NotFound'

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
		</Switch>
	</div>
);

// const TestViewerRoute = (props) => {
// 	return (
// 		<TestViewer trials={[]} questions={[]}
// 		{...props}
// 		/> 
// 	);
// }

// const renderMergedProps = (component, ...rest) => {
//   const finalProps = Object.assign({}, ...rest);
//   return (
//     React.createElement(component, finalProps)
//   );
// }

// const PropsRoute = ({ component, ...rest }) => {
//   return (
//     <Route {...rest} render={routeProps => {
//       return renderMergedProps(component, routeProps, rest);
//     }}/>
//   );
// }

export default Routes;