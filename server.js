const express = require('express');
const path = require('path')

const app = express();

var dir = __dirname.split('/');

dir.pop();
dir = dir.join('/')
console.log(dir);

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/', (req,res) => {
	res.sendFile(__dirname+'/client/build.index.html');
})

const port = process.env.PORT || 5000;
app.listen(port, (error) => {
	if(error)
		console.log(error)
	else
		console.log(`Listening on ${port}`);
});