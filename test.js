var spawn = require("child_process").spawn;
var process = spawn('python',["./script.py", "ahmed", "batee5"]);

process.stdout.on('data', function (data){
	console.log(JSON.parse(data.toString()).key)
});