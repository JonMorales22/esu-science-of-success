import React, { Component } from 'react';
import Modal from 'react-modal';
import { Redirect, Link } from 'react-router-dom'
import { observer } from "mobx-react";
import DevTools from "mobx-react-devtools";

import Question from './Question';
import AudioRecorder from './AudioRecorder';

import ResponseStore from '../stores/ResponseStore.js';
import UserStore from '../stores/UserStore';

import 'whatwg-fetch';

//custom CSS used for our Modal,
const customStyles = {
  content : {
  	textAlign			  : 'center',
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

/*
	TestTaker
		component used to show questions and receive responses from subject. 
		When component first renders, subject is shown a modal that shows them the Test Name, the current trial, and the current question.
		this modal appears everytime the subject starts a new trial. I added this functionality so it was EXPLICITLY clear to the subject the he/she has started
		a new trial. I figured they would be more likey to read the trial prompt if they were notified that the trial has changed.

		Audio data recorded by the subject is sent to the server for analysis AS THE USER ITERATES through the test. when the server sends back a response, we store it here on the client side.
		When the subject has finished with the entire test, we then send ALL the data stored here on the client side to the server so it can be saved to DB.
		Not entirely sure if this is the best way of handling the data, but yolo

		Audio data is stored as blobs. I am sending my data to the server as json objects, unfortunately it is diificuly to send binary data (such as blobs) correctly over json.
		In order to send the blobs to the server as json, I had to convert all their binary data to a base64 string 

		Functionality for a user to skip a question is built in. However I removed the functionality because I don't have enough time to make it work with the DB.
		
		read more about blobs here: https://developer.mozilla.org/en-US/docs/Web/API/Blob

		api endpoints
			GET  /tests
			POST /audioresponse
			POST /saveaudioresponse
		Props:
			none
		Stores:
			UserStore
			ResponseStore
*/

//creates a response store (not part of the test component)
let responseStore = new ResponseStore(20);

//stores all the analyzed data (data received from google)
//before I wrote all this informaton to DB as I received it, but then I decided to do it all in 1 write op at the end 
let data = [];

@observer
class TestTaker extends Component {
	constructor() {
		super();
		this.state = ({
			test_id: '',
			test: null,
			testname: null,
			trials: null,
			questions: null,
			questionsIndex: 0, //index used to keep track of what question the Subject is currently answering
			trialsIndex: 0, //index used to keep track of what trial the subject is currently on
			questionsPerTrial: 0,
			modalIsOpen: true, //show modal which notifies the Subject what trial they are on
			data: [],
			submit: false
		});
		this.handleClick = this.handleClick.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
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
				//update this component's state with all the data received form the server
				let testname = res.test[0].name;
				let trials = res.test[0].trials;
				let questions = res.test[0].questions;

				//we run math.floor should prevent an index out of bounds error if for some reason the # of questions isn't nicely divisible by the # of trials
				let questionsPerTrial = Math.floor(questions.length / trials.length);
				this.setState({ test: res.test[0],  testname: testname, trials: trials, questions: questions, questionsPerTrial: questionsPerTrial })
			} 
		})
	}

	//sends our audio response to server where it gets converted to necessary audio format and sent to the whatever speech to text library the backend is using
	sendDataForAnalysis = () => {
		let index = responseStore.index;
		let response = responseStore.responses[index];
		let audiofile = response.audiofile;
		let blob = audiofile.blob;
		let timeToStartRecord = response.timeToStartRecord;

		let testId = UserStore.testId;
		let testName = UserStore.testName;
		let subjectId = UserStore.subjectId;
		
		let trialsIndex = this.state.trialsIndex;
		let questionsIndex = this.state.questionsIndex;


		if(!blob) {
			console.log('audiofile does not exist!');
			return;
		}

		/*
		convert our blob data to base64 so we can send it as json to the server
		we do this using by using filereader, which is the only way of handling blobs.
		Filereader parses blobs asynchronously, so 1st we load all the data into the file reader and by using an event listener, 
		we we send the data to the server when the file reader is done parsing the data
		*/
		var reader = new FileReader();
		reader.addEventListener('loadend', () => {
			let audio = reader.result;
			fetch('/api/audioresponse', {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ subjectId, testId, testName, timeToStartRecord, trialsIndex, questionsIndex, audio })
			})
			.then(res => res.json())
			.then((res) => {
				if(res.success === false)
					return;
				else {
					//we push the data received from server into our data array
					data.push(res.data);
					//if Subject has reached the end of the test, we send all the data stored in data array up to server to get stored in DB
					if(res.data.questionsIndex===this.state.questions.length-1){
						this.saveAnalyzedData();
					}
				}
			});
		});
		reader.readAsDataURL(blob);
	}

	//sends all the data we have stored in our data array and send it to the server so it can all be written to the DB
	saveAnalyzedData = () => {
		let subjectId = UserStore.subjectId;

		if(!subjectId || !data){
			alert("Something went wrong! Please return to dashboard and try again!");
			return;
		}

		fetch('/api/saveaudioresponse', {
			method: 'POST',
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ subjectId, data })
		})
		.then(res => res.json())
		.then((res) => {
			if(res.success === false)
				alert("error");
			else
				this.setState({ submit: true });
		});
	}

	skipQuestion() {
		let subjectId = UserStore.subjectId;
		data.push({
			transcript: "",
			latency: -10000000,
			trialsIndex: this.state.trialsIndex,
			questionsIndex: this.state.questionsIndex,
			startTime: -10000000
		});
		console.log("data: " + JSON.stringify(data));

		//TEST THIS EDGE CASE!!!!!
		if(data.length === this.state.questions.length){
			this.saveAnalyzedData();
		}
	}

	//since the test data is broken up into two separate arrays (1 for the trials on 1 or the questions) we use 2 different indexes to iterate through the test
	incrementTrialsIndex() {
		this.setState(prevState => {
			if(this.state.trialsIndex < this.state.trials.length-1){
				return {trialsIndex: prevState.trialsIndex+1}
			}
		})	
	}

	incrementQuestionsIndex(){
		this.setState(prevState => {
			if(this.state.questionsIndex < this.state.questions.length){
				return {questionsIndex: prevState.questionsIndex+1}
			}
		})
	}

	handleClick(event) {
		let type = event.target.name;
		if(type === 'next') {
			//save two values from ResponseStore in placeholder variables, I think its more readable this way
			let index = responseStore.index;
			let response = responseStore.responses[index];

			//checks response store to see if we have a response, or if the user can skip the question
			if(!response.hasResponse) {
				alert('Warning: You have not recorded a response! If you wish to skip the question, click the skip button.');
				//responseStore.setSkip(); //uncomment this line if you want to add functionality where user can skip the question
			}
			else if(response.hasResponse || response.canSkip) {
				this.sendDataForAnalysis();
				//if we are on question 0,4,8,12,16 then we show the modal
				if(this.state.questionsIndex % this.state.questionsPerTrial === 3 && this.state.trialsIndex < this.state.trials.length-1) {
					this.incrementTrialsIndex();
					this.openModal();
				}
				if(this.state.questionsIndex < this.state.questions.length-1) {
					responseStore.incrementIndex();
					this.incrementQuestionsIndex();
				}
			}
		}
		else if(type === 'skip') {
			//let skip = window.confirm("Are you sure you want to skip this question? Your response will not be saved!")
			let skip = true;
			if(skip===true) {
				this.skipQuestion();
				if(this.state.questionsIndex % this.state.questionsPerTrial === 3 && this.state.trialsIndex < this.state.trials.length-1) {
					this.incrementTrialsIndex();
					this.openModal();
				}
				if(this.state.questionsIndex < this.state.questions.length-1) {
					responseStore.incrementIndex();
					this.incrementQuestionsIndex();
				}
			}
		}
	}

	openModal() {
		this.setState({modalIsOpen: true});
	}


	closeModal() {
		this.setState({modalIsOpen: false});
	}

	/*
	  Render
	  	first we check to make sure we actually have test data pulled from DB, if not we notify the Subject
	*/
	render() {
		if(this.state.submit === true) {
			return <Redirect to='/demographic-survey'/>
		}
		else if(this.state.trials && this.state.questions) {
			return(
				<div className='test-taker'>
					<div>
						<Modal
				          isOpen={this.state.modalIsOpen}
				          onAfterOpen={this.afterOpenModal}
				          onRequestClose={this.closeModal}
				          style={customStyles}
				          contentLabel="Example Modal"
				        >
				          <h2>{this.state.test.name}</h2>
				          <b>Scenario {this.state.trialsIndex+1}:</b>
				          <div>
				          	The following questions all have to deal with Scenario {this.state.trialsIndex+1}, which is printed at the top. 
				          	<p>Please read the scenario carefully and answer the questions that follow.</p>
				          </div>
				          
				          <hr/>
				          <button name='modal-button' onClick={this.closeModal}>Okay</button>
				        </Modal>
					</div>
					<h1>Scenario {this.state.trialsIndex+1}</h1>
					<textarea name='trial' rows='10' cols='50' value={this.state.trials[this.state.trialsIndex]} readOnly></textarea>

					<hr />
					<Question text={this.state.questions[this.state.questionsIndex]} number={this.state.questionsIndex+1} />
					<AudioRecorder store={responseStore} key={this.state.questionsIndex}/>
					<button name='skip' onClick={this.handleClick}> Skip Question</button>
					<button name='next' onClick={this.handleClick}> Next Question</button>				</div>
			);
		}
		else {
			return (
				<div>
					<p>Sorry! We seem to have lost that information...</p>
					<p>Click <Link to='/dashboard'>here</Link> to go back to dashboard.</p>
				</div>
			)
		}
	}
}

export default TestTaker;