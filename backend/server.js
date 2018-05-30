import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import router from './routes';

const app = express();
const path = require('path');
 /*========================================*/
const PORT = process.env.PORT || 3001;

const DB_USER = 'jonmorales2.718'
const DB_PASSWORD = 'Ma121eY32'

//connect to mongoDB
const db = {
  dbName: 'esu-science-of-success'
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(dir,'/client/build/static')));
}

mongoose.connect('mongodb://' + DB_USER + ':' + DB_PASSWORD + '@ds135540.mlab.com:35540/esu-science-of-success', {dbName: 'esu-science-of-success'} ,(error) => {
	if(error) {
		console.error("Couldn't connect to MongoDB!!")
		throw error;
	}
	console.log("Connected database at mlab: " + db.dbName);
})
.catch(error=> {
	console.log(error);
})


app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(logger('dev'));

var dir = __dirname.split('/');
dir.pop();
dir = dir.join('/');

console.log("index:" + dir + '/client/build/index.html');

app.use(express.static(path.join(dir,'/client/build/')));

app.use('/api', router);

app.listen(process.env.PORT || 5000, () => console.log("Listening to port 5000"));