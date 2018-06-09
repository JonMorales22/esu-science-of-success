require('isomorphic-fetch');
require('dotenv').config();

var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: process.env.DROPBOX_TOKEN });
var fs = require('fs');


/*
	DropboxService
		this class servers as an 'interface' to communicate with the dropbox API. 
		I only implemented code for the stuff I actually need from the Dropbox API


	Dopbox API docs: http://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesPropertiesAdd__anchor
*/

const APPNAME = 'ESU-Science-of-Success';
const dropboxURL = 'https://www.dropbox.com/home/Apps/' + APPNAME;

export class DropboxService {

	get dropboxURL() {
		return dropboxURL;
	}

	/*	
		saveAudio
			saves the audiofile in dropbox:
	 		the path should have the following namine scheme: /testName/subjectId/trialNumber-QuestionNumber.wav
	 	params
	 		fileName - name of the file to be saved to dropbox
	 		path - path to the directory where the file is to be saved 
	 	returns
	 		promise
	*/
	saveAudio(fileName, path) {
		return new Promise((resolve, reject) => {
			var audiofile = fs.readFile(fileName, (error,data) => {
			if(error) {
				console.log('error:' + error);
				reject(error)
			}
			var params = {
				contents: data,
				path: path,
				mode:
					{
						'.tag': 'overwrite'
					},
				autorename: true,
				mute: true,
			}

			dbx.filesUpload(params)
			.then(response => {
				resolve('file uploaded!');
			})
			.catch(error => {
				reject(error);
			})
		});
		})
	}

	/*
		createFolder
			creates a folder in dropbox.
		params
			path - a string representing path of the directory to be created. 
				   If necessary, the drobbox api automatically creates any subdirectories that don't exist in the path 
		returns
			promise
	*/

	createFolder(path) {
		console.log('in dropboxservice -> create folder')
		var params = {
			path: path,
			autorename: false,
		}
		return new Promise(function(resolve, reject) {
			dbx.filesCreateFolderV2(params)
			.then(response => {
				var message = 'Folder created at: reseachly' + path;
				resolve(message);
			})
			.catch(error => {
				reject(error)
			})
		})
	}

	/*
		deleteFolder
			deletes a folder in Dropbox.
		param
			path - string 
		returns
			promise
	*/

	deleteFolder(path) {
		console.log('in dropboxservice -> delete folder');
		console.log(path);
		return new Promise(function(resolve, reject) {
			dbx.filesDeleteV2({ path: path })
			.then(response => {
				var message = "Folder deleted at: researchly" + path;
				console.log(message);
				resolve(message);
			})
			.catch(error => {
				console.log(error);
				reject(error);
			})
		})
	}
}

export let dropboxService = new DropboxService();