var express = require('express')
var multer = require('multer')
var path = require('path')
var mongoose = require('mongoose')
var fs = require('fs')
var User = require('./models/user.js')
var bodyParser = require('body-parser')
var session = require('express-session');

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

var storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, 'public/images/')
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname)
	}
})

var upload = multer({storage: storage})


app.use(bodyParser.json() );// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({// to support URL-encoded bodies
  extended: true
})); 

//Schema and model for database

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

//use sessions for tracking logins
app.use(session({
	secret: 'work hard',
	resave: true,
	saveUninitialized: false
}));

//API Routes
//Homepage
app.get('/', function(req,res){
	res.sendFile('public/html/puzzle.html', { root: __dirname })
})

//Upload button
app.post('/api/upload', upload.single('pic'), (req, res) => {
	if (!req.file) {
		console.log("No file received");
		return res.send({success: false});
	} else {
		//Save to db
		var newImage = new Picture({
			filepath: req.file.originalname
		});
		newImage.save(function (err, comment){
			if (err) console.log(error);
			else console.log('Saved to db succesfully:', comment)
		})
		res.sendFile('public/html/puzzle.html', { root: __dirname })
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

//Register page
app.get('/login/register', function(req,res){
	res.sendFile('public/html/register.html', { root: __dirname })
})

//Login user
app.post('/login', function(req,res, next){
	if (req.body.email && req.body.password) {
		User.authenticate(req.body.email, req.body.password, function (error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			} else {
				req.session.userId = user._id;
				return res.redirect('/');
			}
		});
	} else {
		var err = new Error('All fields required.');
		err.status = 400;
		return next(err);
	}
})

//Register user
app.post('/login/register', function (req, res, next) {
	//User types password in twice correctly
	if (req.body.password != req.body.passwordConfirm) {
		var err = new Error('Passwords do not match.');
		err.status = 400;
		res.send("Passwords do not match.");
	}
	if (req.body.email && req.body.password && req.body.passwordConfirm) {
		var userData = {
			email: req.body.email,
			password: req.body.password,
			passwordConfirm: req.body.passwordConfirm,
		}
		User.create(userData, function (error, user) {
			if (error) {
				res.send('error in creation')
			} else {
				req.session.userId = user._id;
				return res.redirect('/');
			}
		});
	}
})

app.get('/logout', function (req, res, next) {
	if (req.session) {
		//Delete session object
		req.session.destroy(function (err) {
		if (err) {
			return next(err);
		} else {
			return res.redirect('/');
		}
	  });
	}
});

app.get('/game', function (req, res, next) {
	User.findById(req.session.userId)
	.exec(function (error, user) {
		if (error) {
		  return next(error);
		} else {
		  if (user === null) {
			var err = new Error('Login first!!');
			err.status = 400;
			return res.redirect('/login')
		  } else {
			return 	res.sendFile('public/html/puzzle.html', { root: __dirname })
		  }
		}
	  });
});

app.post('/game/highscore', function(req, res, next){
	/*User.findById(req.session.userId)
	.exec(function (error, user) {
		if (error) {
		  return next(error);
		} else {
		  if (user === null) {
			var err = new Error('Login required for highscore!');
			err.status = 400;
			return res.redirect('/login')
		  } else {
			User.create(userData, function (error, user) {
				if (error) {
					res.send('error in creation')
				} else {
					req.session.userId = user._id;
					return res.redirect('/');
				}
			});
		  }
		}
	  });*/
})

//Start app @ localhost:8000
app.listen(8000,function(){
	console.log('Running on localhost:8000');
})

