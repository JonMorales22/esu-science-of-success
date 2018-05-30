import React, { Component } from 'react';
import {ReactMic} from 'react-mic';
import { observer } from "mobx-react";
import recordIcon from '../assets/record-icon.png';

let initialState = ({
	record: false,
	timeToStartRecord: -1,
	audiofile: {
		blob: null,
		blobURL: 'test',
	}
});

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
		if(this.state.timeToStartRecord < 0) {
			timeToStartRecord = this.findtimeToStartRecord(startTime, endTime);
			this.setState({ timeToStartRecord: timeToStartRecord });
		}

		this.props.store.setTimeToStartRecord(timeToStartRecord);
		console.log("End Time: " + endTime);		
		console.log("timeToStartRecord: "+ timeToStartRecord);
		
		this.setState({ record: true });
	}

	stopRecording() {
		this.setState({
			record: false
		});
	}

	// onData(recordedBlob) {
	// 	console.log('chunk of real-time data');
	// }

	onStop(recordedBlob) {
		console.log(recordedBlob);
		if(recordedBlob) {
			this.props.store.setResponse();
			this.props.store.setAudiofile(recordedBlob);
			console.log('Recorded blob is:', recordedBlob);
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
					backgroundColor='#FFF' />
				<div className='button-holder'>
					<button onClick={this.startRecording} type='button'>Start Recording</button>
					<button onClick={this.stopRecording} type='button'>Stop Recording</button>
				</div>
			</div>
		)
	}
}

export default AudioRecorder