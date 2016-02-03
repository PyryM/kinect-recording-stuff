var Kinect2 = require('kinect2'),
    fs = require('fs');

var kinect = new Kinect2();
var recordTime = 120;
var curTime = 0.0;
var updatePeriod = 1000;

var data = [];

//// Some helper functions

// Returns true if at least one body is being tracked
function hasTrackedBody(bodyframe) {
  var bodies = bodyframe.bodies;
  for(var i = 0; i < bodies.length; ++i) {
    if(bodies[i].tracked) {
      return true;
    }
  }
  return false;
}

// 

if(kinect.open()) {
  console.log("Going to record data for " + recordTime + " seconds.");
  setInterval(updateTime, updatePeriod);

  kinect.on('bodyFrame', function(bodyFrame){
    pushData(bodyFrame);
  });

  kinect.openBodyReader();
}

function pushData(bodyframe) {
  if(hasTrackedBody(bodyframe)) {
    data.push(bodyframe);
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
  data = [];
}

// generates a new filename based on the date/time
function makeSafeFilename() {
  return "recorded_data/data_" + Date.now() + ".json";
}

// saves an object as json
function saveAsJSON(thing, filename) {
  var s = JSON.stringify(thing, null, '\t');

  fs.writeFile(filename, s, function(err) {
    if(err) {
      return console.log(err);
    }

    console.log("Log " + filename + " saved.");
  }); 
}