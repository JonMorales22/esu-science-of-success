import React, { Component } from 'react';

//404 component, rendered if a route isn't found
class NotFound extends Component {
	render() {
		return(
			<div>
				<h1>404 not found!</h1>
				<p>We seem to have misplaced the page you are looking for... Sorry about that.</p>
				<p>Click here to go back to dashboard.</p>
			</div>
		)
	}
}

export default NotFound;