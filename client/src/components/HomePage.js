import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

/*
	Disclose Agreement
		component used to let user know what's going down with this test app.
		the way it works is pretty straightforward, not gonna add too many comments
*/

class HomePage extends Component {
	constructor() {
		super();
		this.state = ({ accepted: false, submit: false });
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(event) {
		let name = event.target.name;
		if(name === 'continue') {
			this.handleContinue();
		}
	}

	handleContinue() {
		this.setState({ submit: true })
	}

	render() {
		if(this.state.submit === true) {
			return <Redirect to='/dashboard'/>
		}
		else{
			return (
				<div className='App'>
					<div className='info-container'>
						<h1>Welcome!</h1>
						<p>This is the <b>East Stroudsburg University Science of Success</b> web application!</p>
						<p>Please hit the continue button to proceed.</p>
					</div>
					<div className='disclose-agreement'>
						<button value='Continue' name='continue' onClick={this.handleClick}> Continue </button>
					</div>

				</div>	
			)
		}
	}
}

export default HomePage;