var express = require('express')
var multer = require('multer')

global.__rootdir = __dirname
const app = express()

var upload = multer({
	destination: '__rootdir/imgs/',
	filename: 'test'
})

app.get('/', function(req,res){
	res.sendFile('public/html/puzzle.html', { root: __dirname })
})

app.post('/api/upload', upload.single('pic'), (req, res) => {
	if (!req.file) {
	  console.log("No file received");
	  return res.send({
		success: false
	  });
  
	} else {
	  console.log('file received');
	  return res.send({
		success: true
	  })
	}
  });

app.listen(8000,function(){
	console.log('Running on localhost:8000');
})

