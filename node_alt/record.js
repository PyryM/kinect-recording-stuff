var Kinect2 = require('kinect2'),
    fs = require('fs');

// Note: kinect 2 joint order is given here:
// https://msdn.microsoft.com/en-us/library/microsoft.kinect.kinect.jointtype.aspx

var kinect = new Kinect2();
var data = [];

if( kinect.open() ) {
    kinect.on('bodyFrame', function(bodyframe) {
        data.push(bodyframe);
    });
    kinect.openBodyReader();

    setInterval(saveData, 60000);
} else {
    console.log("Error opening kinect!");
}

function saveData() {
    var filename = "data_" + Date.now() + ".json";
    var datastring = JSON.stringify(data, null, '/t');
    fs.save(filename, datastring, function(err) {
        if(err) {
            console.log("Error saving data!");
            console.log(err);
        } else {
            console.log("Saved " + filename);
        }
    });
    data = [];
}

