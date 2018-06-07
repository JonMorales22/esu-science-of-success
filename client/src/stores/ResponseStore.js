import { observable, action } from "mobx";

/*
	ResponsesStore
		used to keep track of a user's responses while they take a test.
*/

class ResponseStore {
	@observable responses = [];
	@observable index = 0;

	constructor(numOfResponses) {
		for(let i=0; i<numOfResponses; i++)
			this.responses.push({
				hasResponse: false,
				canSkip: false,
				audiofile: null,
				timeToStartRecord: -1,
			});
	}

	@action.bound
	incrementIndex() {
		if(this.index < this.responses.length-1)
			this.index++
	}

	@action.bound
	setSkip() {
		this.responses[this.index].canSkip = true;
	}

	@action.bound
	setResponse() {
		console.log('setResponse');
		this.responses[this.index].hasResponse = true;
	}

	@action.bound
	setAudiofile(audiofile) {
		this.responses[this.index].audiofile = audiofile;
	}

	@action.bound
	setTimeToStartRecord(timeToStartRecord) {
		this.responses[this.index].timeToStartRecord = timeToStartRecord;
	}
}

export default ResponseStore;