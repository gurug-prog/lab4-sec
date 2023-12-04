'use strict';

const request = require('request');

const auth0Login = (email, password) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `https://${process.env.DOMAIN}/oauth/token`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'http://auth0.com/oauth/grant-type/password-realm',
        audience: process.env.AUDIENCE,
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
  return new Promise((resolve, reject) => {
    const options = {
      method: 'POST',
      url: `https://${process.env.DOMAIN}/oauth/token`,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      form: {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
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


module.exports = {
  auth0Login,
  auth0LoginRefreshToken
};
