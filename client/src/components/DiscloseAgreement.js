import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

/*
	Disclose Agreement
		component used to let user know what's going down with this test app.
		the way it works is pretty straightforward, not gonna add too many comments
*/

class DiscloseAgreement extends Component {
	constructor() {
		super();
		this.state = ({ accepted: false, submit: false });
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		let name = event.target.name;
		if(name === 'agreement') {
			this.handleAgreement();
		}
		else if(name === 'continue') {
			this.handleContinue();
		}
	}

	handleContinue() {
		this.setState({ submit: true })
	}

	handleAgreement() {
		if(!this.state.accepted)
			this.setState({accepted: true});
		else
			this.setState({accepted: false})
	}

	render() {
		if(this.state.submit === true) {
			return <Redirect to='/dashboard'/>
		}
		else{
			return (
				<div className='App'>
					<div className='info-container'>
						<h1>Welcome to Researchly!</h1>
						<p>This is the East Stroudsburg University IAT examination blah blah blah</p>
					</div>
					<div className='disclose-agreement'>
						<p>Disclaimer: These examinations will collect some data regarding your ethnicity, age, yadda yadda yadda</p>
						<p>Please check the box if you agree to these terms.</p>
							<input type='checkbox' name='agreement' value={this.state.accepted} onClick={this.handleClick}/> Agree
							<p><button value='Continue' name='continue' disabled={!this.state.accepted} onClick={this.handleClick}> Continue </button></p>
					</div>

				</div>	
			)
		}
	}
}

export default DiscloseAgreement;