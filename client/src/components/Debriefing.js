import React, { Component } from 'react';
import UserStore from '../stores/UserStore'

/*
	Debriefing
		Pulls debriefing data from DB and displays it. The debriefing data is apart of the 'test' collection in MongoDb
	API endpoints - GET /test/:testId
	props - none
*/

class Debriefing extends Component {
	constructor() {
		super();
		this.state = {
			test: null,
			debriefing: '',
			submit: false
		}
	}

	componentDidMount() {
		this.loadTestFromServer();
	}

	loadTestFromServer = () => {
		//fetch sends the requests, 
		let testId = UserStore.testId;

		fetch(`/api/tests/${testId}`, { 
			method: 'GET',
	    	headers: { "Content-Type": "application/json" },
	    })
		.then(res => res.json())
		.then((res) => {
			if(!res.success) {
				alert(res.error)
			}
			else 
				this.setState({ test: res.test, debriefing: res.test[0].debriefing });
		})
	}

	render() {
		let debriefing = this.state.debriefing;
		return( 
			<div className='debriefing'>
				<h1>Debriefing:</h1>
				 <textarea name='debriefing' rows='20' cols='75' type="text" value={debriefing} readOnly></textarea>
			</div>
		)
	}
}

export default Debriefing;