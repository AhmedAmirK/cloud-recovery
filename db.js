var Mongo = require('mongodb').MongoClient;
var bcrypt = require('bcrypt-nodejs');
var db;

module.exports.init = function (callback) {
	Mongo.connect("mongodb://root:admin@ds111124.mlab.com:11124/cloud_users", function(err, database) {
  	if(!err) {
    	callback();
    	db = database.collection('users');
  	}
  	else callback(err);
	});
}

module.exports.createUser= function (username, id, token, callback) {
	db.insert({username: username, id:id, token:token},{w:1}, function (err, result) {
		if(err)
			callback(err,null)
		else {
			res = result.ops[0];
			callback(null,res);
		}
	});
}

module.exports.findUser= function (id, callback) {
	db.findOne({id:id}, function (err, item) {
		if(err)
			callback(err,null);
		else callback(null,item);
	});
}

module.exports.setKeys= function (username,key,id, callback) {
	var hash = bcrypt.hashSync(key);
	db.update({id:id},{$set: {api_user: username, key: key}}, {w:1}, function (err,result) {
		if(err)
			callback(err);
		else callback();
	});
}

module.exports.setRecoverySettings= function (options,id, callback) {
	db.update({id:id},{$push: {ids: options.id, 
								imageNames: options.imagename,
								hostnames: options.hostname,
								domains: options.domain,
								hasRecovery: options.hasRecovery}}, {w:1}, function (err,result) {
		if(err)
			callback(err);
		else callback();
	})
}
