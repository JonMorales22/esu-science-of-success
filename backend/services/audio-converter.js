var shell = require('shelljs');
var atob = require('atob');
var fs = require('fs');
const path = require('path');



/*
	AudioConverter
		this class serves as an interface to the Ffmpeg audio converter. ffmpeg is an external, command line executable that can process pretty much any video/audio
		filetype you can think of. My code uses an npm package called 'shelljs' (which allows me to make command line/terminal/shell calls from within this script)
		to call ffmpeg and so it can do its thing. I realize this probably isn't the best approach, but whatevs.
 
		ffmpeg docs: https://www.ffmpeg.org/ 
*/
const directory = 'tmp/';
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

	constructor() {
		var dir = __dirname.split('/');
		dir.pop();
		dir.pop();
		rootDir = dir.join('/');
		ffmpegPath = path.join(rootDir,'/vendor/ffmpeg');
	}

	/*
		saveAudio
			takes in an audio file encoded in base64, converts it to binary, and then converts it to webm,
			finally it saves it to disk.
			this surprisngly works synchronously... pretty sure I'm gonna have to make sure this works asynchronously later
		params: 
			base64Audio - audio file encoded in base64, this file will be converted to webm
			fileName - the name of the converted file webm file
		returns:
			promise that contains the new file name. returning a promise with the filename/type makes this more flexible, 
			just in case I want to convert the base64 audio to something other than webm in the future (only god knows if I'd ever do that)
	*/
	saveAudio(base64Audio, fileName) {
		console.log('Attempting to save ' + fileName + ' to disk...');
		var newFileName =  rootDir + '/' + directory + fileName + originalAudioType;
		
		var mkdir = fileName.substring(0,fileName.indexOf('/'));
		mkdir = rootDir + '/' +directory + mkdir

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
			})	
		})
	}

	/*
		convertAudio
			Converts an audio file from disk into a mono channel wav file.
			If the audio gets successfully converted, it then deletes the old file from disk.
		params:
			fileName - 
		returns:
			promise - conatians a string that represents tbe new file name
	*/
	convertAudio(fileName) {
		console.log('in convertAudio => ');
		console.log('ffmpeg path: ' + ffmpegPath);
		console.log('audio dir path: ' + rootDir);
		var oldAudioFile = rootDir + '/' + directory + fileName + originalAudioType;
		var newAudioFile = rootDir + '/' + directory + fileName + convertedAudioType;
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

	//JESUS CODE: DO NOT TOUCH
	//takes base64 audio file and converts it to a binary stream

	/*
		convertDataURItoBinary
			-DISLCAIMER: I did not write this code, I found it on somewhere in the deep depths of github. I'm going to explain what's going on
			in this method as I understand it, however I may be incorrect.

			First find any markers/extraneous data in our binary string and chop it off.
			Then use atob method to convert the base 64 string into a normal binary string
			third create a new array uint array buffer and input the binary string 
	*/
	convertDataURIToBinary(dataURI) {
	  var BASE64_MARKER = ';base64,';	 	
	  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
	  var base64 = dataURI.substring(base64Index);

	  //atob is natively found in browsers. Since the server isn't in browser I had to install an npm package to use atob 
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