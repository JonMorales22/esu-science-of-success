import React, { Component } from 'react';
import {RadioGroup, Radio} from 'react-radio-group'
import { Redirect, Link } from 'react-router-dom'
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";
import UserStore from '../stores/UserStore';
import 'whatwg-fetch';


/*
	Test Dashboard: 
		The "main" component of the app. It lists all tests and allows the user to select a test and perform operations on then
		There are two views: 
			1. Researcher View
				-The researcher view is only accessible if the user has signed in through the 'login' page,
				-allows users to create, delete, and view tests. Also allows them to export the test data.
			2. Subject View:
				-default view, is shown to user if they haven't logged in.
				-only allows users to take tests
	props: 
		none
*/

@observer
class TestDashboard extends Component {
	constructor() {
		super()
		this.state = {
			tests: [], //the tests that were loaded from DB
			view: false, //bool which toggles the single test view
			error: null, //dont think I use this, can probably be deleted later
			index: -1, //the index of the selected test
			submit: false, //used to redirect user after data has been submitted
		}
		this.handleClick = this.handleClick.bind(this);
		this.handleListChange = this.handleListChange.bind(this);
	}

	//pulls tests from DB only after component has mounted
	componentDidMount() {
		this.loadTestsFromServer();
	}

	//loads tests from DB and saves them in this objects state.... not sure if that is the greatest idea ever but YOLO
	loadTestsFromServer = () => {
		//fetch sends the requests, 
		fetch('/api/tests')
			//then we take response (res) and parse it to json
			.then(res => res.json())
			//after the response has been parsed to json, we use the data we received from it
			.then((res) => {
				if(!res.success) this.setState({});
				else this.setState({ tests: res.tests })
			})
	}

	//takes selected test and deletes it from DB
	onDeleteTest = () => {
		if(!UserStore.isLoggedIn) {
			alert("Test not deleted. Please login to delete a test!");
		}
		//checks user has selected a test and that the test exists
		if(this.state.tests.length>0&&this.state.index>=0) {
			let test = this.state.tests[this.state.index];
			
			let id = test._id;
			let testName = test.name;
			let trials = test.trials;
			let questions = test.questions;

			fetch(`/api/tests/${id}`, { 
				method: 'DELETE',
		    	headers: { "Content-Type": "application/json" },
		    	body: JSON.stringify({ testName, trials, questions })
		    })
		    //first takes response, parses it to json. then it uses the data
			.then(res => res.json()).then((res) => {
				if(!res.success) { 
					//this.setState({ error: res.error})
					alert(res.error);
				}
				else {
					//removes selected test from this objects state... admittedly I should probably be using MOBx for this, but whatevs
					let data = [
						...this.state.tests.slice(0,this.state.index),
						...this.state.tests.slice(this.state.index+1)
					]
					//make sure we set index
					this.setState({ tests: data,index: -1 })
					alert('Test successfully deleted!')
				};
			})
		}
	}



	onTakeTest() {
		if(this.state.tests.length>0&&this.state.index>=0) {
			let test = this.state.tests[this.state.index];
			
			let testId = test._id;
			let testName = test.name;

			fetch(`/api/subjects`, { 
				method: 'POST',
		    	headers: { "Content-Type": "application/json" },
		    	body: JSON.stringify({ testName, testId  })
		    })
		    //first takes response, parses it to json. then it uses the data
			.then(res => res.json()).then((res) => {
				if(!res.success) { 
					alert(res.error);
				}
				else {
					UserStore.setTestId(this.state.tests[this.state.index]._id);
					UserStore.setTestName(this.state.tests[this.state.index].name)
					UserStore.setSubjectId(res.subject._id);
					
					console.log("Test Id:" + UserStore.testId);
					console.log("Test Name:" + UserStore.testName);
					this.setState({ submit: true });
				};
			})
		}
	}

	//used to handle React-Radio buttons input
	//NOTE: react-radio buttons do no throw an event when user interacts with them!!! (I'm pretty sure this is true)
	handleListChange(value) {
		this.setState({ index: value})
	}


	handleClick(event) {
		let type = event.target.name;
		if(type === 'view') {
			this.setState({ view: !this.state.view})
		}
		else if(type === 'delete') {
			this.onDeleteTest();
		}
		else if(type === 'export') {
			console.log('export');
		}
		//stores necessary info needed to correctly pull test data across different pages/components in UserStore
		else if(type === 'take-test') {
			this.onTakeTest();
		}
		else if(type==='logout') {
			UserStore.logIn();
		}
	}


	/*
	  renderTestList
		renders all the tests that exist in state. Uses React-Radio Button component because its a pain in the ass to do on my own.
		Basically it creates a JSX sandwich, first creating all the radio values and their labels (which is the meat) and then encloses
		that in a RadioGroup component (the buns). 

		returns
			JSX sandwich containing our RadioList of tests
	*/
	renderTestList() {
		let testsArray = this.state.tests;
		//the meat of our JSX sandwich
		let listItems = testsArray.map((test, index) => 
			<label id={test._id} key={test._id}>
				<Radio value={index}/>{test.name}<br/>
			</label>
		);
		return (
			//places the buns around our sandwich meat and then returns
			<RadioGroup name='list' selectedValue={this.state.selectedValue} onChange={this.handleListChange}>
				{listItems}
			</RadioGroup>
		)
	}

	/*
	  RenderSingleTest
	  	renders the test at tests[index]. tests array and index are found in state.
	  	Index is determined by which test user selected in the radio button group.
	  	the way this single test is rendered is very similar to the way is rendered.
	  	we use a nested for loop to basically create a 2d array, where trials=rows and questions=columns.
	  	A better way to visualize this is using our JSX sandwich analogy. We basically create 4 different 'sandwiches',
	  	with trialsForms as the buns, and questionFroms as the sandwich meat.
	*/
	renderSingleTest(index) {
		//our JSX sandwich buns
		let trialsForms = [];
		let debriefing;
		//first we make sure User has selected a test
		if(index >= 0) {
			//I place all data in placeholder variables, I think it makes it easier to read the code.
			let test = this.state.tests[index];
			let trials = test.trials;
			let questions = test.questions;
			debriefing = test.debriefing;
			let maxRows = 4;

			//we put the test title on first, think of this as an olive or something... idk lol
			trialsForms.push(<h1>Test Name: {test.name}</h1>)
			trialsForms.push(<h3>Test Id: {test._id} </h3>)

		    for(let x=0;x<trials.length;x++)
		    {
		      //array to hold our questions forms. these is where we assemble all our JSX sandwich meat
		      let questionForms = [];
		      for(let y=0;y<4;y++) {
		        
		        //index used to map our 1d array to 2 dimensions
		        let i = (x*maxRows)+y;

		        //here we create all the JSX sandwich meat
		        questionForms.push(
		          <div className='question' key={i}>
		            <h3>Question {y+1}</h3>
		              <textarea name='question' rows='10' cols='50' value={questions[i]} key={i} readOnly></textarea>
		          
		          </div>
		        )
		      }

		      //assemble our sandwich. we push our questionsforms first then wrap it with 
		      trialsForms.push(
		        <div className='trial' key={x}> {/*top part of our 'trial' sandwich bunz*/}
		          <h3>Trial {x+1}</h3>
		          <h4>Trial Info:</h4>
		      
		          <textarea name='trial' rows='10' cols='50' value={trials[x]} key={x} readOnly></textarea>
		          <div className='questions-holder'>
		            {questionForms} {/*our question forms aka sandwich meat*/}
		          </div>
		          <hr />
		        </div> //the bottom part of our trial sandwich bun
		      )
		    }
		}

		trialsForms.push(
			<div className='debriefing'>
				<h3>Debriefing:</h3>
				 <textarea name='debriefing' rows='20' cols='75' type="text" value={debriefing} readOnly></textarea>
			</div>
		)

		return trialsForms
	}

	render() {
		let testList = this.renderTestList();
		let test = []; //our single test holder

		//use can toggle whether they want to view a test or not. if user selected a test and toggles view on, then test = the selected test, else set test = an empty array
		if(this.state.view)
			test= this.renderSingleTest( this.state.index );
		else
			test = [];

		//redirects use to the 1st part of our test
		if(this.state.submit === true){
			return <Redirect to='/test' />
		}
		//if user is logged in, render Researcher view
		else if(UserStore.isLoggedIn) {
			return(
				<div className='dashboard'>
				<DevTools />
							<h1>Test Dashboard:</h1>
							<h2>Logged in as Researcher</h2>
							<button name='logout' onClick={this.handleClick}> Logout </button>
							<hr/>
							<div className='testlist'>
								<h1>Tests:</h1>
								<Link to="/test-creator"> <button>Create New Test</button> </Link>
								{testList}
							</div>
							<div className = 'btn-holder'>
								<button name='view' onClick={this.handleClick}> View </button>
								<button name='export' onClick={this.handleClick}> Export </button>
								<button name='delete' onClick={this.handleClick}> Delete </button>
								<button name='take-test' onClick={this.handleClick}> Take Test </button>
							</div>
							<div className = 'test-holder'>
								{test}
							</div>
				</div>
			)
		}
		//if user is not logged in, render subject view
		else{
			return(
				<div className='dashboard'>
				<DevTools />
							<h1>Test Dashboard:</h1>
							<p>Please select a test and hit "Take Test" button to continue.</p>
							<hr/>
							<div className='testlist'>
								<h1>Tests:</h1>
								{testList}
							</div>
							<div className = 'btn-holder'>
								<button name='take-test' onClick={this.handleClick}> Take Test </button>
							</div>
				</div>
			)
		
		}
	}
}



export default TestDashboard;