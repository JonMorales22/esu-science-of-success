import React, { Component } from 'react';
import UserStore from '../stores/UserStore'

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
		//then we take response (res) and parse it to json
		.then(res => res.json())
		//after the response has been parsed to json, we use the data we received from it
		.then((res) => {
			if(!res.success) {
				alert(res.error)
			}
			else {
				console.log(res.test);
				this.setState({ test: res.test, debriefing: res.test[0].debriefing })
			}
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