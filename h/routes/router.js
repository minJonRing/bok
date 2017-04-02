var express = require('express');
var router = express.Router();

var models = require('../schema/user')
var mongoose = require('mongoose')

router.route('/api/sign').post(function(req,res,next){
	var username = req.body.username
	var password = req.body.password
	var a = new RegExp('^[A-Za-z0-9]+$')
	console.log('sign')
	if(username && password && a.test(username) && a.test(password)){
		var user = {
		username:username,
		password:password
		}
		models.users.findOne({username:username},function(err,data){
			if(err || data){
				res.send(204)
			}else{
				models.users.create(user,function(err,data){
					res.send(200)
				})
			}
		})
	}else{
	    res.send(404)
	}
})
router.route('/api/login').post(function(req,res,next){
	var username = req.body.username
	var password = req.body.password
	var a = new RegExp('^[A-Za-z0-9]+$')
	if(username && password && a.test(username) && a.test(password)){
		var user = {
		username:username,
		password:password
		}
		models.users.findOne({username:username,password:password}).populate('texts').exec(function(err,data){
			if(!err && data){
				req.session.user = data
				res.send(data)
			}else{
				res.send(204)
			}
		})
	}else{
	    res.send(404)
	}
})

// router.route('/api/addUserInfo').post(function(req,res,next){
// 	console.log(req.body)
// 	res.send('/user/58dc77420074841220188037')
// })
// router.route('/addtext').get(function(req,res,next){
// 	console.log(req.session.cookie + '5')
// 	res.send(req.session.user)
// })
router.route('/api/getlists').post(function(req,res,next){
		models.texts.find({}).sort('-_id').populate('fate').exec(function(err,data){
			if(!err && data){
				res.send(data)
			}else{
				res.send(204)
			}
		})
})

router.route('/api/getuser').post(function(req,res,next){
	var id = req.body.user;
	models.users.findById(id).populate('texts').exec(function(err,data){
		if(!err && data){
			res.send(data)
		}
	})
})

router.route('/api/updatauserinfo').post( (req,res,next) => {
	var id = req.body.id,name = req.body.name,state = req.body.state;

	models.users.update({_id:id},{$set:{name:name,state:state}}).exec( (err,data) => {
		if(!err && data){
			models.texts.find({}).populate('fate').exec((err,data)=>{
				if(!err && data){
					res.send(data)
				}
			})
		}
	})
})
// router.route('/api/addtext').post(function(req,res,next){
// 	var setid =  new mongoose.Types.ObjectId
// 	var texts = {
// 		_id: setid,
// 		title:req.body.title,
// 		text:req.body.text,
// 		fate:req.session.user._id
// 	}
// 	models.users.findOne({_id:req.session.user._id},function(err,data){
// 		if(!err && data){
// 			data.texts.push(setid)
// 			data.save()
// 			models.texts.create(texts,function(err,data){
// 				res.send(200)
// 			})
// 		}else{
// 			res.send(204)
// 		}
// 	})

// })

router.route('/api/textadd').post(function(req,res,next){
	var setid = req.body.fate , arr = [];
	var tid = new mongoose.Types.ObjectId;

	if(req.session.user._id == setid){
		var setObj = {
			_id:tid,
			title:req.body.title,
			text:req.body.text,
			fate:setid
		}
		models.texts.create(setObj,function(err,data){
			if(!err && data){
				models.users.findById(setid,function(err,data){
					data.texts.push(tid)
					data.save()
					models.texts.find({}).populate('fate').exec(function(err,data){
						if(!err && data){
							arr.push(tid,data)
							res.send(arr)
						}
					})
				})
			}else{
				res.send(404)
			}
		})
		// models.users.findById(setid,function(err,data){
		// 	data.texts.push(tid)
		// 	data.save()
		// 	models.texts.create(setObj,function(err,data){
		// 		if(!err && data){
		// 			res.send(200)
		// 		}
		// 	})
		// })
	} 
})

router.route('/api/save').post(function(req,res,next){
	var title = req.body.title,text = req.body.text,user = req.body.user
	models.texts.update({title:title},{$set:{text:text}},function(err,data){
		if(!err && data){
			models.texts.find({}).populate('fate').exec(function(err,data){
				if(!err && data){
					res.send(data)
				}
			})
			// models.users.findById(user).populate('texts').exec(function(err,doc){
			// 	arr.push(doc)
			// 	models.texts.find({},function(err,val){
			// 		arr.push(val)
			// 		console.log(arr)
			// 		res.send(arr)
			// 	})
				
			// })
		}else{
			res.send(204)
		}

	})
})

router.route('/api/delate').post(function(req,res,next){
	var title = req.body.title,uid = req.body.uid,tid = req.body.tid,arr =[]
	models.texts.remove({title:title},function(err,data){
		if(!err && data){
			models.texts.find({}).populate('fate').exec(function(err,data){
				if(!err && data){
					res.send(data)
				}
			})
			// models.users.findById(uid,function(err,data){
			// 	data.texts.splice(data.texts.indexOf(tid),data.texts.indexOf(tid)+1)
			// 	data.save()
			// 	arr.push(data)
			// 	models.texts.find({},function(err,data){
			// 		if(!err && data){
			// 			arr.push(data)
			// 			res.send(arr)
			// 		}
			// 	})
			// })
		}
	})
})

router.route('/api/init').post(function(req,res,next){
	var user = req.body.user
	if(req.session.user){
		if(req.session.user._id == user) res.send(200)
	}else{
		res.send(204)
	}
})

router.route('/api/logout').post(function(req,res,next){
	req.session.user = null;
	console.log(req.session.user )
	res.send(200)
})
module.exports = router