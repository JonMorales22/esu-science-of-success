const fs = require('fs');
const speech = require('@google-cloud/speech');
require('dotenv').config();

/*
	GoogleSpeechService
		Class that interfaces to the GoogleSpeech Api (GSA). The GSA is pretty picky about the audio it can process. 
		For example it can only process mono .wav or mono .flac audio files with a sample rate of 48000 hz or above, etc etc.
		The audio files must also be sent as a JSON object, so we must convert the audio file to base64 before we send it to Google.

	Google Speech to Text API Docs: https://cloud.google.com/speech-to-text/docs/apis
*/

/* 
the google API doesn't make it easy to use your token properly.
In the documentation, they mention authenicating your google account by creating a SpeechClient object and passing the PATH to your token.json file
However this is not safe because in order to use the services on Heroku, you would have to upload your token to the server and it would just get messy.
What I did instead is take all the data in the token.json file and put it into environment variables, then reate a SpeechClient object while passing those environment variables in through the constructor
*/
var priv_key = process.env.GOOGLE_PRIVATE_KEY;
priv_key= "-----BEGIN PRIVATE KEY-----\n" + priv_key + "\n-----END PRIVATE KEY-----";

const client = new speech.SpeechClient({
  credentials: {
    "type": process.env.GOOGLE_ACCOUNT_TYPE,
    "project_id": process.env.GOOGLE_PROJECT_ID,
    "private_key_id": process.env.GOOGLE_PRIVATE_KEY_ID,
    "private_key": priv_key.replace(/\\n/g, '\n'),
    "client_email": process.env.GOOGLE_CLIENT_EMAIL,
    "client_id": process.env.GOOGLE_CLIENT_ID,
    "auth_uri": process.env.GOOGLE_AUTH_URI,
    "token_uri": process.env.GOOGLE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.GOOGLE_AUTH_PROVIDER_CERT,
    "client_x509_cert_url": process.env.GOOGLE_CLIENT_CERT_URL
  }
})	



//google requires you to specify all the params of the audio file you are sendning to API
const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 48000,
    languageCode: 'en-US',
    enableWordTimeOffsets: true
};

export class GoogleSpeechService {

	/*
		Analyze Speech
			sends audio file to Google. The audio file must first be converted to base64 before sending to to Google!!!
		params
			fileName - string that represents name of file to be read
		returns
			Promise - json object that contains all the relevant data that we receive from google API
			the json object has following body
				{transcript: string, latency: number}
	*/
	analyzeSpeech(fileName) {
		console.log('in GoogleSpeechService -> analyze speech');

		return new Promise((resolve, reject) => {
			this.readFile(fileName)
		    .then(audio => {
		    	const request = { config: config, audio: audio };
		    	client
	    		.recognize(request)
	    		.then(data => {
	    			//google api sends us back a lot of bs, we only pick out what we need
				    const response = data[0];
				    
				    var timestamps = [];
				    response.results.forEach(data => {
				    	//console.log(data);
				    	timestamps = timestamps.concat(this.getTimeStamps(data));
				    })
				    var transcript = this.getTranscript(response.results);


		     		var googleData = { transcript: transcript, latency: timestamps[0].startTime,  timestamps: timestamps };
		     		resolve(googleData); 
	    		})
	    		.catch(error => {
	    			reject(error);
	    		})
	    	})
		    .catch(error => {
		    	reject(error);
		    })
		})
	}

	getTimeStamps(results) {
		let timestamps = [];
		results.alternatives[0].words.forEach(ass => {
			let startTime = this.getTimes(ass.startTime);
			let endTime = this.getTimes(ass.endTime);
			let poop = ass.word;
			timestamps.push({ word: poop, startTime: startTime, endTime: endTime });
		})
		return timestamps;
	}

	getTimes(data) {
		let seconds = data.seconds;
		let nanos = data.nanos / 100000000;
		return seconds + "." + nanos;
	}

	getTranscript(words) {
		const transcription = words
		.map(result => result.alternatives[0].transcript)
	    .join('\n');
	    return transcription;
	}

	/*	readFile
			async reads a file and converts it to base64, 
			params
				fileName - string representing file to be read/converted
			returns 
				promise  - json object that contains the contents of file
	*/
	readFile(fileName) {
    	console.log("in GooleSpeechService => readFile");
    	return new Promise((resolve, reject) => {
        	fs.readFile(fileName.toString('base64'), (error, data) => {
	          	if(error) {
	            	console.log(error);
	            	reject(error);
	          	}
	          	else {
	            	const audio = { content: data }
	            	resolve(audio);
	          	}
        	})
    	})
  	}
}

export let googleSpeechService = new GoogleSpeechService();