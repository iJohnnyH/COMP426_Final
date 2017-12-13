var mongoose = require('mongoose');

var pictureSchema = new mongoose.Schema({
	filepath:{
		type: String,
		unique: true
	}
})

var Picture = mongoose.model('Picture',pictureSchema)
module.exports = Picture