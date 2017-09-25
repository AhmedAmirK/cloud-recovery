module.exports= function (app,passport) {

	var spawn = require("child_process").spawn;

	//var auth = require('auth');
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
		var user = req.body.username;
		var key = req.body.key;

		if(user_id && user && key){
			db.setKeys(username,key,user_id, function (err) {
				if(err)
					res.status(500).json({'message':'Something went wrong'});
				else res.status(200).json({'message':'API Key Saved'})
			});
			
		}
		else res.status(400).json({'message':'Missing Info'})

	});



	app.get('/servers/:user_id', isLoggedIn, function (req,res,next) {
		db.findUser(function (err,user) {
			if(err)
				throw err
			if(user){
				let username = user.api_user;
				let key = user.key;
				var process = spawn('python',["./script.py", username, key]);
				process.stdout.on('data', function (data){
					res.status(200).json(JSON.parse(data.toString()));
				});
			}
			else{
				res.status(500).json('message':'user not found');
			}
		})
	});



	//SAVE RECOVERY OPTIONS 
	app.post('/options/:user_id', isLoggedIn, function (req,res,next) {
		var user_id = req.params.user_id;
		var options = req.body
		if(!user_id && !options)
			res.status(400).json({'message':'Missing Info'});
		else{
			var result = db.setRecoverySettings(user_id,options, function (err) {
			if(err)
				res.status(500).json({'message':'Something went wrong'});
			else  res.status(200).json({'message':'Settings Saved'});
			
			});

		}

	});


	app.use(function(req, res, next) {
      res.redirect('/')
   });




}