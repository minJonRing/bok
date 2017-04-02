var mongoose = require('mongoose')
var Schema = mongoose.Schema

var users = Schema({
	username:{type:String,unique:true,requires:true},
	password:{type:Number,requires:true},
	image:{type:String},
	state:{type:String},
	name:{type:String},
	texts:[{type:Schema.Types.ObjectId,ref:'texts'}]
})

var texts = Schema({
	_id:{type:Schema.Types.ObjectId},
	title:{type:String},
	text:{type:String},
	fate:{type:Schema.Types.ObjectId,ref:'users'}
})

var models = {
	users:mongoose.model('users',users),
	texts:mongoose.model('texts',texts)
}

module.exports = models