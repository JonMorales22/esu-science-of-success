import React, { Component } from 'react';
import { observer } from "mobx-react";
import { Redirect, Link } from 'react-router-dom'

import UserStore from "../stores/UserStore";
import 'whatwg-fetch';

/*
	Login
		Component rendered when a user wants to login as a Researcher.
	api endpoints
		POST /subjects
	props: none
*/
@observer
class Login extends Component {
	constructor() {
		super();
		this.state = ({
			username: '',
			password: '',
			submit: false
		})
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		let type = event.target.name;
		let value = event.target.value;
		if(type === 'username')
			this.setState({ username: value });
		else if(type === 'password')
			this.setState({ password: value });
	}


	//simple validation, only checks if the user has filled out the forms. Could probably make this a lot more robust
	validateForm(username, password) {
		if(this.state.username.length > 0 && this.state.password.length > 0){
			return true;
		}
		else {
			return false; 
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		if(this.validateForm()) {
			const { username, password } = this.state;
			fetch('/api/login', {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password })
			})
			.then(res => res.json())
			.then((res) => {
				if(res.success === true ) {
					UserStore.logIn();
					this.setState({ submit: true })
				}
				else if(res.success === false) {
					alert(res.error);
				}
			})
		}
	}

	render() {
		if(this.state.submit === true) {
			return <Redirect to='/dashboard' />
		}
		return(
			<div className='login'>
				<h1>Researchly Login:</h1>
				<p><b>This page is for those with adminstrative access only!</b></p>
				<p>Researchly does not require you to create a username/password or sign in to take a test! </p>
				<p>If you got here on accident, please click <Link to='/dashboard'>here</Link> to return.</p>
				<br/>
				<form onSubmit={this.handleSubmit}>
					<br/>
					Username:
					<input type='text' name='username' value={this.state.username} onChange={this.handleChange} />
					
					<br/>
					Password:
					<input type='password' name='password' value={this.state.password} onChange={this.handleChange} />

					<br/>
					<button type='submit'>Submit</button>
				</form>
			</div>
		)
	}
}

export default Login;