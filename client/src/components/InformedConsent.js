import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

import UserStore from '../stores/UserStore';
/*
	Disclose Agreement
		component used to let user know what's going down with this test app.
		the way it works is pretty straightforward, not gonna add too many comments
*/

const test_data = "test data for the informed consent"

class InformedConsent extends Component {
	constructor() {
		super();
		this.state = ({  data: test_data ,submit: false });
		this.handleClick = this.handleClick.bind(this);
	}

	//loads our test from DB when component mounts
	componentDidMount() {
		this.loadTest();
	}

	//loads test from and stores it in state... maybe it would be better to create Test Store and store test in the TestDashboard component
	//that would be 1 less call to the database
	loadTest = () => {
		let test_id = UserStore.testId;
		fetch(`/api/tests/${test_id}`, { method: 'GET' })
		.then(data => data.json())
		.then((res) => {
			if(!res.success){
				alert( 'error: ' + res.error);
			} 
			else {
				this.setState({ data: res.test[0].informed_consent });
			} 
		})
	}


	handleClick(event) {
		let name = event.target.name;
		if(name === 'continue') {
			this.setState({ submit:true });
		}
	}

	render() {
		let informed_consent = this.state.data;
		if(this.state.submit){
			return <Redirect to='/test'/>
		}
		return( 
			<div className='informed-consent'>
				<h1>Informed Consent:</h1>
				<p>Please read the following. When you are finished click the "Continue" button to begin taking the test.</p>
				 <textarea name='informed-consent' rows='20' cols='75' type="text" value={informed_consent} readOnly></textarea>
				<p><button name='continue' onClick={this.handleClick}>Continue</button></p>
			</div>

		)
	}
}

export default InformedConsent;