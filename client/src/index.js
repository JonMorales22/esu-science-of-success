import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Routes from './routes'
import './index.css';

//We may be able to use the HashRouter component instead, which may fix the issue where the app breaks when user either refreshes the browser

ReactDOM.render(
	<BrowserRouter>
		<Routes />
	</BrowserRouter>, document.getElementById('root')
);

