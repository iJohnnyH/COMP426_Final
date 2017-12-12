var express = require('express')
var multer = require('multer')
var path = require('path')
var mongoose = require('mongoose')
var fs = require('fs')
var passport = require('passport')
, FacebookStrategy = require('passport-facebook').Strategy;

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

app.use(express.static(path.join(__dirname, 'public')))

//Schema and model for database
//User

//Picture
var pictureSchema = mongoose.Schema({
	filepath: String
})
var Picture = mongoose.model('Picture',pictureSchema)

//Connect to mongodb
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	console.log('Connected to database')
});

passport.use(new FacebookStrategy({
    clientID: '1931153717204962',
    clientSecret: '2b0fd0069d9223f7d5adfeefd07e00e1',
    callbackURL: "http://localhost:8000/"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//API Routes

//Homepage
app.get('/', function(req,res){
	res.sendFile('public/html/puzzle.html', { root: __dirname })
})

//Upload button
app.post('/api/upload', upload.single('pic'), (req, res) => {
	if (!req.file) {
		onsole.log("No file received");
		return res.send({success: false});
	} else {

		console.log('File received')
		console.log(req.file)
		console.log(req.file.originalname)

		//Save to db
		var newImage = new Picture({
			filepath: req.file.originalname
		});
		newImage.save(function (err, comment){
			if (err) console.log(error);
			else console.log('Saved to db succesfully:', comment)
		})
		return res.send({success: true})
	}
});

//Send names of images in /images
app.get('/api/images', function(req, res){
	var fileList = [];
	fs.readdirSync('./public/images').forEach(file => {
		//Ignore hidden file created by OSX
		if (file != '.DS_Store')
			fileList.push(file)
	})
	res.send(fileList)
})

//Login page
app.get('/login', function(req,res){
	res.sendFile('public/html/login.html', { root: __dirname })
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {failureRedirect: '/login'}),
	function(req,res){
		res.redirect('/')
	});

app.get('/login/register', function(req,res){
	res.sendFile('public/html/register.html', { root: __dirname })
})


//Start app @ localhost:8000
app.listen(8000,function(){
	console.log('Running on localhost:8000');
})

