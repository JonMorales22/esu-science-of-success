var shell = require('shelljs');
var atob = require('atob');
var fs = require('fs');
const path = require('path');
//don't know why this audio-converter automatically outputs to the /backend directory, so I just added this variable to put all output in a /backend/audio directory 
const directory = 'audio/';

//if you need to convert audio files from something other than webm to wav, I guess you can just change these variables
const originalAudioType = '.webm';
const convertedAudioType = '.wav';
var ffmpegPath = '';
var rootDir = '';
/*
	AudioConverter:
		This class converts an audio file  encoded in base64, converts it to binary, and then converts it to .webm, then saves it to disk.
		The class then converts that .webm file to .wav, and then turns that .wav into a mono file.
		It relies on a program called ffmpeg (which is pretty dope btw) to convert from .web to .wav. 
		I use shell.js is an npm package used to perform terminal commands and call ffmpeg, I couldn't figure out a better way to use ffmpeg from script
		Not really sure how this class converts from base64 to .webm, I found some jesus code on stack exchange and plugged it in and it worked
		Params: none
		returns : none
*/

export class audioConverter {

	/*
		saveAudio
			takes in an audio file encoded in base64, converts it to binary, and then converts it to webm,
			finally it saves it to disk.
			this surprisngly works synchronously... pretty sure I'm gonna have to make sure this works asynchronously later
		params: 
			base64Audio - audio file encoded in base64, this file will be convreted to webm
			fileName - the name of the converted file webm file
		returns:
			promise that contains the new file name. returning a promise with the filename/type makes this more flexible, 
			just in case I want to convert the base64 audio to something other than webm in the future (only god knows if I'd ever do that)
	*/
	constructor() {
		var dir = __dirname.split('/');
		dir.pop();
		dir.pop();
		rootDir = dir.join('/');
		ffmpegPath = path.join(rootDir,'/vendor/ffmpeg');
	}

	saveAudio(base64Audio, fileName) {
		console.log('Attempting to save ' + fileName + ' to disk...');
		var newFileName = directory + fileName + originalAudioType;
		
		var mkdir = fileName.substring(0,fileName.indexOf('/'));
		mkdir = directory + mkdir

		shell.mkdir('-p', mkdir);

		console.log("mkdir:" + mkdir);
		console.log("newFileName: " + newFileName);

		//blocking may occur here in this function call... idk how quickly the base64 webmfile can be converted to binary data
		var audio = this.convertDataURIToBinary(base64Audio); 
		
		return new Promise(function(resolve, reject) {
			//save file to disk, if error occurs abandon all hope
			fs.writeFile(newFileName, audio, (err,res) => {
				if(err) {
					console.log("writeFile -> " + err)
					reject(err);
				} 
				else {
					console.log(fileName + ' successfully saved to disk with following name: ' + newFileName)
					resolve(newFileName);
				} 
				//this.checkFiles('audio/output.wav', 'audio/outputMono.wav', this.convertAudio(filename));
			})	
		})
	}

	/*
		convertAudio
			this method is basically an interface for external classes to use the audio-converter.
			first it converts the .webm file to wav, then it converts the new wav file from stereo to mono
		params:
			fileName - 
		returns:
			nono - might have to return a promise later
	*/
	convertAudio(fileName) {
		console.log('in convertAudio => ');
		console.log('ffmpeg path: ' + ffmpegPath);
		console.log('audio dir path: ' + rootDir);
		var oldAudioFile = rootDir + directory + fileName + originalAudioType;
		var newAudioFile = rootDir + directory + fileName + convertedAudioType;
		return new Promise((resolve, reject) => {
			shell.exec( ffmpegPath + '/./ffmpeg -y -i ' + oldAudioFile + ' -vn  -ac 1 ' + newAudioFile + ' -loglevel quiet', error => {
				if(error) {
					console.log(error);
					reject(error);
				}
				else {
					var message = 'successfully converted to ' + convertedAudioType;
					console.log('deleting file from disk: ' + oldAudioFile);
					shell.rm(oldAudioFile);
					console.log(message);
					resolve(newAudioFile);
				}
			})
		})
	}

	// checkFile(fileName) {
	// 	console.log('in checkFile -> fileName: ' + fileName);
	// 	var flag=false;
	// 	return new Promise((resolve, reject) => {
	// 		if(shell.test('-e', fileName)) {
	// 			flag = true;
	// 	    	shell.rm(fileName);
	// 		}
	// 		resolve(fileName);
	// 	})
	// }


	//JESUS CODE: DO NOT TOUCH
	//takes base64 audio file and converts it to a binary stream
	convertDataURIToBinary(dataURI) {
	  var BASE64_MARKER = ';base64,';	 	
	  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	  var base64 = dataURI.substring(base64Index);
	  var raw = atob(base64);
	  var rawLength = raw.length;
	  var array = new Uint8Array(new ArrayBuffer(rawLength));

	  for(var i = 0; i < rawLength; i++) {
	    array[i] = raw.charCodeAt(i);
	  }
	  return array;
	}
}

export let audioconverter = new audioConverter();