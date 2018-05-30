const fs = require('fs');
const speech = require('@google-cloud/speech');

//Google Speech to Text API: https://cloud.google.com/speech-to-text/docs/apis

// Creates a client
const client = new speech.SpeechClient();

const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 48000,
    languageCode: 'en-US',
    enableWordTimeOffsets: true
};

export class googleSpeechService {
  constructor(){}

  readFile(fileName) {
    console.log("in gooleSpeechService => readFile");
    return new Promise((resolve, reject) => {
        fs.readFileSync(filename.toString('base64'), (error, data) => {
          if(error) {
            console.log(error);
            reject(error);
          }
          else {
            const audio = { content: data }
            resolve(audio);
          }
        })
        // const audio = {
        //   content: fs.readFileSync(filename).toString('base64'),
        // };
    })
  }

	analyzeSpeech(fileName) {
    console.log('in googleapi -> analyze speech');
    //google stuff
    this.readFile(fileName)
    .then(data => {

    })
    .catch(error => {
      throw error;
    })


    const request = {
      config: config,
      audio: audio,
    };

    client
    .recognize(request)
    .then(data => {
      const response = data[0];
      
      let seconds = response.results[0].alternatives[0].words[0].startTime.seconds;
      let nanos = response.results[0].alternatives[0].words[0].startTime.nanos / 100000000;
      let start = seconds + '.' + nanos;

      //console.log('Start Time in seconds: ' + start);


      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      //console.log(`Transcription: `, transcription);

      // var data1 = { transcript: transcription, start: start }

      // return (data1);
    })
    .catch(err => {
      console.error('ERROR:', err);
    });  
		}

    extractData() {

    }
}

//export let googlespeech = new googleSpeechService();