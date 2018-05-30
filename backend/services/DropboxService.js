require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
var dbx = new Dropbox({ accessToken: 'tk0SIp3rdvAAAAAAAAAAGD_969WY93_KCvoVQdKx3e-rKpxUTX_gOrwK4MGE28H2'});
var fs = require('fs');


//link to dropboxAPI: http://dropbox.github.io/dropbox-sdk-js/Dropbox.html#filesPropertiesAdd__anchor

const APPNAME = 'Researchly';
const dropboxURL = 'https://www.dropbox.com/home/Apps/' + APPNAME;

export class DropboxService {

	/*	saves the audiofile in dropbox:
	 	the path should follow the following params:
		/testName/subjectId/trialNumber-QuestionNumber.wav
	*/
	get dropboxURL() {
		return dropboxURL;
	}

	saveAudio(fileName, path) {
		console.log('in dropboxservice -> save test');
		console.log(path);

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