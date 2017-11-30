var express = require('express');
var app = express();

app.get('/', function(req,res){
	res.sendFile('main.html', { root: __dirname });
})

app.listen(8000,function(){
	console.log('Running on localhost:8000');
})

