const { nextISSTimesForMyLocation } = require('./iss');
const { printPassTimes } = require('./printPassTimes');

/*
 Find times to spot the International Space Station flyovers the location
 The function finds the IP of the server where it runs, then finds a location of it (latitude and longtitude), then pulls the data of flyovers for a given location
*/

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});