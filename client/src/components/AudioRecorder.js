import React, { Component } from 'react';
import {ReactMic} from 'react-mic';
import { observer } from "mobx-react";
import recordIcon from '../assets/record-icon.png';

/*
	AudioRecorder:
		Used to record Subject's audio in browser.
		This component relies on npm package 'react-mic' which does all the heavy lifting.
		I built ontop of the package, adding/removing functionality as I needed it.
		While the Subject is recording, a png of a 'recording symbol' flashes on and off. 

		The audio is recorded and stored as a blob file... which is a pain the ass to work with.

		read more about blobs here: https://developer.mozilla.org/en-US/docs/Web/API/Blob

	props:
		ResponsesStore - pretty sure that this component did not work correctly if we directly manipulated the ResponseStore within the component.
						 The solution was passing the ResponseStore in as props and then manipulating it through props.... I may be wrong though. May have to retest this later

*/
		
//variable that holds all the initial state information. Pretty sure this is unneccesary, but I don't want to remove it for fear of messing something up.
let initialState = ({
	record: false,
	timeToStartRecord: -1,
	audiofile: {
		blob: null,
		blobURL: 'test',
	}
});

//We hold two variables here to keep calculate start time. We save the UTC time of when the component first mounts,
//and when the Subject clicks on button to start recording audio. startTime-endTime = timeToStartRecord
//we hold these variales out here because they are pretty much completely independent of react
let startTime;
let endTime;

@observer
export class AudioRecorder extends Component {
	constructor(props) {
		super(props);
		this.state = (initialState);
		this.startRecording = this.startRecording.bind(this)
		this.stopRecording = this.stopRecording.bind(this)
		this.onStop = this.onStop.bind(this)
	}

	componentDidMount() {
		startTime = new Date();
		console.log("Start Time: " + startTime);
	}

	startRecording() {
		endTime = new Date();
		let timeToStartRecord = -1;

		//we make sure that if Subject has already clicked record, that we don't try to recalculate the start time
		if(this.state.timeToStartRecord < 0) {
			timeToStartRecord = this.findtimeToStartRecord(startTime, endTime);
			//pretty sure storing timeToStartRecord in state is useless b/c its getting stored in the ResponseStore.
			this.setState({ timeToStartRecord: timeToStartRecord });
			this.props.store.setTimeToStartRecord(timeToStartRecord);
		}

		this.setState({ record: true });
	}

	stopRecording() {
		this.setState({
			record: false
		});
	}

	onStop(recordedBlob) {
		if(recordedBlob) {
			this.props.store.setResponse();
			this.props.store.setAudiofile(recordedBlob);
			//pretty sure setting audiofile in state here is usesless b/c its getting put into the ResponseStore
			this.setState({
				audiofile: recordedBlob
			})
		}
	}

	findtimeToStartRecord(startTime, endTime) {
		return (endTime-startTime)/1000; //divide by 1000 to strip the miliseconds
	}

	render() {
		let isRecording;
		if(this.state.record)
			isRecording = <img className='record-icon-on' src={recordIcon} alt='' />;
		else
			isRecording = <img className='record-icon-off' src={recordIcon} alt='' />;
		return(
			<div className='audio-recorder'>
				{isRecording}
				<ReactMic
					record={this.state.record}
					className='sound-wave'
					onStop={this.onStop}
					strokeColor='#000000'
					backgroundColor='#FFF'
				/>
				<div className='button-holder'>
					<button onClick={this.startRecording} type='button'>Start Recording</button>
					<button onClick={this.stopRecording} type='button'>Stop Recording</button>
				</div>
			</div>
		)
	}
}

export default AudioRecorder