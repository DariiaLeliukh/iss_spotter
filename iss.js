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

    if (body && body.success === true) {
      let result = { latitude: data.latitude, longitude: data.longitude }
      callback(null, result);
    }
  });
}

module.exports = { fetchMyIP, fetchCoordsByIP };