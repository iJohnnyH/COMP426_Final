var mongoose = require('mongoose');
var User = require('./user.js')
var Picture = require('./picture.js')

var scoreSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId, ref: 'User',
		unique: false,
		required: true,
	},
	userName: {
		type: String,
		required: false		
	}, 
	score: {
		type: Number,
		required: true
	},
	picture: {
		type: mongoose.Schema.Types.ObjectId, ref: 'Picture',
		required: true
	}
});

var Score = mongoose.model('Score', scoreSchema);
module.exports = Score;
