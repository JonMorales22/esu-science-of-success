import {googleSpeechService} from './googleSpeechService.js';
import {audioconverter} from './audio-converter.js';

var shell = require('shelljs');

export class HandleAudioService {

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