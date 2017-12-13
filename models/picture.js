var mongoose = require('mongoose');

var pictureSchema = new mongoose.Schema({
	filepath: String
})

var Picture = mongoose.model('Picture',pictureSchema)
module.exports = Picture