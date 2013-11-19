var mongodb = require('../models/db');
//var crypto = require('crypto');
var User = require('../models/user');
var Stoc = require('../models/stoc');

var stock={};
module.exports = stock;

stock.show = function(req,res){
	var id=/[0-9]{6}/.exec(req.params.uid);
	var isWatch=false;
	if(req.session.user){
		for(var i=0,l=req.session.user.stock.length;i<l;i++){
			if(req.params.uid==req.session.user.stock[i]){
				isWatch=true;
			}
		}
	}
	
	res.render('stock', {
		id:id,
		isWatch:isWatch,
		user:req.session.user
	});
}

stock.watch=function(req,res){
	var uid=req.params.uid;
	var stoc = new Stoc({
		name: req.query.name, 
		uid: req.query.uid,
		top: req.query.add,
		beWatch: {
			name:req.query.beWatchName,
			top:req.query.beWatchTop
		} 
	});
	//插入stock数据
	stoc.watch(function(data){
		if(data.status==200){
			if(req.query.add==1){
				req.session.user.stock.push(data.uid);
			}else{
				var newSe=[];
				for(var i=0,l=req.session.user.stock.length;i<l;i++){
					if(req.session.user.stock[i]!=data.uid){
						newSe.push(req.session.user.stock[i]);
					}
				}
				req.session.user.stock=newSe;
			}
			res.send({ok:true});
		}
	})
}

stock.aboutName=function(req,res){
	var uid=req.query.uid;
	Stoc.aboutName(uid,function(obj){
		if(obj){
			res.send({ok:true,info:obj});
		}else{
			res.send({ok:false});
		}
	});
}