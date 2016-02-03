var Kinect2 = require('kinect2'),
	express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	fs = require('fs');

var kinect = new Kinect2();
var recordTime = 120;
var curTime = 0.0;

app.use(express.static('public'));

var data = [];

if(kinect.open()) {
	server.listen(8000);
	console.log('Server listening on port 8000');
	console.log('Point your browser to http://localhost:8000');

	console.log("Going to record data for " + recordTime + " seconds.");
	setInterval(updateTime, 1000);

	kinect.on('bodyFrame', function(bodyFrame){
		pushData(bodyFrame);
		io.sockets.emit('bodyFrame', bodyFrame);
	});

	kinect.openBodyReader();
}

function pushData(bodyframe) {
	//console.log(bodyframe);
	var bodies = bodyframe.bodies;
	for(var i = 0; i < bodies.length; ++i) {
		if(bodies[i].tracked) {
			data.push(bodyframe);
			return;
		}
	}
}

function updateTime() {
	curTime++;
	if(curTime >= recordTime) {
		saveData();
		curTime = 0.0;
	}
}

function saveData() {
	saveAsJSON(data, makeSafeFilename());
}

// generates a new filename based on the date/time
function makeSafeFilename() {
  var t = Date.now();
  return "recorded_data/data_" + t + ".json";
}

// saves an object as json
function saveAsJSON(thing, filename) {
  var s = JSON.stringify(thing);

  fs.writeFile(filename, s, function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("Log " + filename + " saved.");
  }); 
}