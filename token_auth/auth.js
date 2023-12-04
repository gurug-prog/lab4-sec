'use strict';

const DOMAIN = 'dev-pvt80dp8uf3da7mx.us.auth0.com';
const CLIENT_ID = 'HtvpENKqHdG4fpBNNG2FvfP4ttCPkNJB';
const CLIENT_SECRET = '7shl53p3R9BfkmaADX4exX90bg2qGADKP6vhB-zs_qtEyD1jza_A_O8j80HiWPtg';
const AUDIENCE = 'https://custom-api.com/';

const request = require('request');

const auth0Login = (email, password) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `https://${DOMAIN}/oauth/token`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
        audience: AUDIENCE,
        username: email,
        password: password,
        realm: 'Username-Password-Authentication',
        scope: 'offline_access'
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        reject(error);
      }

      resolve(body);
    });
  });
};

const auth0LoginRefreshToken = (refreshToken) => {
  const options = {
    method: 'POST',
    url: `https://${DOMAIN}/oauth/token`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    form: {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }
  };

  request(options, (error, response, body) => {
    if (error) {
      throw new Error(error);
    }

    console.log(body);
  });
};


module.exports = {
  auth0Login,
  auth0LoginRefreshToken
};
