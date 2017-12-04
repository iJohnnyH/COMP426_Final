var express = require('express')
var multer = require('multer')
var path = require('path')

global.__rootdir = __dirname

const app = express()

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
	  callback(null, 'public/images/')
	},
	filename: function (req, file, callback) {
	  callback(null, file.originalname)
	}
  })

var upload = multer({storage: storage})

app.get('/', function(req,res){
	res.sendFile('public/html/puzzle.html', { root: __dirname })
})

app.post('/api/upload', upload.single('pic'), (req, res) => {
	if (!req.file) {
		onsole.log("No file received");
		return res.send({success: false});
	} else {
		console.log('File received')
		console.log(req.file)
		console.log(req.file.originalname)
		return res.send({success: true})
	}
});

app.listen(8000,function(){
	console.log('Running on localhost:8000');
})

