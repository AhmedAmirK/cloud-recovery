module.exports= function (app,passport) {

	//var spawn = require("child_process").spawn;

	//var auth = require('auth');

	var PythonShell = require('python-shell');

	var db = require('./db');

	isLoggedIn = function (req,res,next) {
		if(req.isAuthenticated())
			next();
		else {
			res.status(401).json({'message':'UnAuthorized'});
		}
	}

	//AUTH ROUTES

	app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google'),function (req,res,next) {
    	console.log(req.user.id);
    	res.redirect('/#/home/'+req.user.id);
    });

    app.get('/auth/github', passport.authenticate('github',{ scope: [ 'user:email' ] }));

    app.get('/auth/github/callback', passport.authenticate('github'), function (req,res,next) {
    	console.log(req.user.id);
    	res.redirect('/#/home/'+req.user.id);
    })



	//SAVE API KEY AND USERNAME
	app.post('/api/:user_id', isLoggedIn, function (req,res,next) {
		var user_id = req.params.user_id;
		var user = req.body.user;
		var key = req.body.key;

		if(user_id && user && key){
			db.setKeys(user,key,user_id, function (err) {
				if(err)
					res.status(500).json({'message':'Something went wrong'});
				else res.status(200).json({'message':'API Key Saved'})
			});
			
		}
		else res.status(400).json({'message':'Missing Info'})

	});



	app.get('/servers/:user_id', isLoggedIn, function (req,res,next) {
		var user_id = req.params.user_id;
		db.findUser(user_id,function (err,user) {
			if(err)
				throw err
			if(user){
				let username = user.api_user;
				let key = user.key;
				if(!username || !key){
					res.status(412).json({'message':'no API key saved'});
				}
				var options = {
  					args: [username, key]
				};
 
				PythonShell.run('script.py', options, function (err, results) {
  					if (err){
  						res.status(400).json({'message':'Invalid API'});
  					} 
  					// results is an array consisting of messages collected during execution
  					let machines = JSON.parse(results[0]);
  					for (var i = 0; i < machines.length; i++) {
  						machines[i] = {
  							id: machines[i].id,
  							domain: machines[i].domain,
  							hostname: machines[i].hostname,
  							fullname: machines[i].fullyQualifiedDomainName,
  							status: machines[i].status.name
  						}
  					}
  					res.status(200).json({'machines':machines});
				});



			}
			else{
				res.status(404).json({'message':'user not found'});
			}
		})
	});



	//SAVE RECOVERY OPTIONS 
	app.post('/options/:user_id', isLoggedIn, function (req,res,next) {
		var user_id = req.params.user_id;
		var options = req.body
		if(!user_id || !options)
			res.status(400).json({'message':'Missing Info'});
		else{
			var result = db.setRecoverySettings(user_id,options, function (err) {
			if(err)
				res.status(500).json({'message':'Something went wrong'});
			else  res.status(200).json({'message':'Settings Saved'});
			
			});

		}

	});

	app.post('/recovery/:user_id', isLoggedIn, function (req,res,next) {
		var user_id = req.params.user_id;
		var machine_id = req.body.id;
		var recovered = req.body.hasRecovery;
		if(!user_id || !machine_id || !recovered)
			res.status(400).json({'message':'Missing Info'});
		else{
			var result = db.setRecoveredMachine(user_id,machine_id, function (err) {
				if(err)
					res.status(500).json({'message':'Error writing to DB'});
				else res.status(200).json({'message':'Saved!'});
			})
		}
	});


	app.use(function(req, res, next) {
      res.redirect('/')
   });




}