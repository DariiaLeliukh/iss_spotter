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
    if (body) {
      console.log(body);
      let result = JSON.parse(body).ip;
      callback(null, result);
    }
  });
}

module.exports = { fetchMyIP };