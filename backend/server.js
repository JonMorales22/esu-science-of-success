require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import router from './routes';
import passport from './passport-config';


const app = express();
const path = require('path');

const PORT = process.env.PORT || 5000;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

//connect to mongoDB
const db = {
  dbName: process.env.DB_NAME
}

var dir = __dirname.split('/');
dir.pop();
dir = dir.join('/');

if (process.env.NODE_ENV === 'production') {
  console.log("We are in production mode.")
  app.use(express.static(path.join(dir,'/client/build/')));
}
else {
   console.log("We are in dev mode")
}

mongoose.connect('mongodb://' + DB_USER + ':' + DB_PASSWORD + '@ds135540.mlab.com:35540/esu-science-of-success', {dbName: DB_NAME} ,(error) => {
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
app.use(passport.initialize());
app.use(logger('dev'));

app.use('/api', router);

app.listen(PORT, () => console.log("Server is listening to port:" + process.env.PORT));