import {googleSpeechService} from './googleSpeechService.js';
import {audioconverter} from './audio-converter.js';

var shell = require('shelljs');

/*
	HandleAudioService
		interface that the routes.js file uses to communicate with the audio-converter and witht he google services.
		Essntially the routes file doesn't have any knowledge of these two external services.
		All it knows is that it use this class's handleAudio method to take care of (most) its audio needs.
		This means that (theoretically) we can use any audio converter and speech to text services. To use other services, all you would
		do is refactor the code located in this file.
*/

export class HandleAudioService {

	/*
		handleAudio
			uses audio converter to convert the audio and save it to disk
		params
			audio - audiofile in base64 to be converted
			filename - ???????
		returns
			promise containing string that represents the file name of the newly converted audio file
	*/
	handleAudio(audio, filename) {
		return new Promise((resolve, reject) => {
			audioconverter.saveAudio(audio, filename)
			.then(result => {
				console.log(result)
				return;
			})
			.then(result => {
				audioconverter.convertAudio(filename)
				.then(newFileName => {
					resolve(newFileName);
				})
			})
			.catch(error => {
				throw error;
			})
		})
	}

	/*
		deleteFile
			deletes file form disk.
		params
			string - respresents file to be deleted
		returns
			promise contianing filename that was deleted
	*/

	deleteFile(fileName) {
		console.log('deleting file from disk: ' + fileName);
		var flag=false;
		return new Promise((resolve, reject) => {
			if(shell.test('-e', fileName)) {
				flag = true;
		    	shell.rm(fileName);
			}
			resolve(fileName);
		})
	}

	/*
		sends file to external audio service.
		params
			filename - string represents file to be sent to external service
		returns
			promise
	*/

	sendAudioToExternalService(fileName) {
		return new Promise((resolve, reject) => {
			googleSpeechService.analyzeSpeech(fileName)
			.then(data => {
				resolve(data);
			})
			.catch(error => {
				reject(error);
			})
		})
	}
}

export let handleAudioService = new HandleAudioService();