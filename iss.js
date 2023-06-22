const request = require('request');

/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const fetchMyIP = function(callback) {
  console.log('Fetching IP... Be patient, it can take some time!');

  request('https://api.ipify.org?format=json&callback=getIP', (error, response, body) => {

    if (error) {
      callback(error, null);
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    if (body) {
      let result = JSON.parse(body).ip;
      callback(null, result);
    }
  });
}

/*
  Makes a single API request to retrieve longtitude and latitude for the given IP
  Input:
    - a string with ip
    - a callback (to pass back an error or the object with latitude and longtitude )
  Returns (via callback)
    - An error, if any (nullable)
    - The object with latitude and longtitude. 
      Example: { latitude: 49.8997541, longitude: -97.1374937 }

*/
const fetchCoordsByIP = function(ip, callback) {
  request('http://ipwho.is/' + ip, (error, response, body) => {

    if (error) {
      callback(error, null);
    }

    const data = JSON.parse(body);

    if (data.success === false) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return;
    }

    if (body) {
      let result = { latitude: data.latitude, longitude: data.longitude }
      callback(null, result);
    }
  });
}

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {
  if (coords.latitude && coords.longitude) {
    request('https://iss-flyover.herokuapp.com/json/?lat=' + coords.latitude + '&lon=' + coords.longitude, (error, response, body) => {
      if (error) {
        callback(error, null);
      }

      const data = JSON.parse(body);

      if (data.message !== 'success') {
        const message = `The response status was ${data.message}. Something went wrong when fetching for coordinates ${coords}.\n Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
        callback(Error(message), null);
        return;
      }

      if (data.message === 'success' && data.response) {
        callback(null, data.response);
      }
    });

  } else {
    const message = `Something went wrong. Try checking if you provided coordinates`;
    callback(Error(message), null);
    return;
  }
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */
const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }


      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
}

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };