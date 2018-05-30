import express from 'express';


const app = express();
const path = require('path');


var dir = __dirname.split('/');
dir.pop();
dir = dir.join('/');

console.log("index:" + dir + '/client/build/index.html');

app.use(express.static(path.join(dir,'/client/build/')));

app.get('/', (req, res) => {
  res.sendFile(path.join(dir,'/client/build/index.html'));
});

app.listen(process.env.PORT || 5000, () => console.log("Listening to port 5000"));