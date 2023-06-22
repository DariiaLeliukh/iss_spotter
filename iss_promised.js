const request = require('request-promise-native');

/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  console.log('Fetching IP... Be patient, it can take some time!');
  return request('https://api.ipify.org?format=json');
}

/* 
 * Makes a request to ipwho.is using the provided IP address to get its geographical information (latitude/longitude)
 * Input: JSON string containing the IP address
 * Returns: Promise of request for lat/lon
 */
const fetchCoordsByIP = function(body) {
  const result = JSON.parse(body).ip;
  return request('http://ipwho.is/' + result);
};

/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 * Returns: Promise of request
 */
const fetchISSFlyOverTimes = function(body) {

  const data = JSON.parse(body);
  let coords = { latitude: data.latitude, longitude: data.longitude };
  return request('https://iss-flyover.herokuapp.com/json/?lat=' + coords.latitude + '&lon=' + coords.longitude);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    })
    .catch(error => console.log(error));
}

module.exports = { nextISSTimesForMyLocation };