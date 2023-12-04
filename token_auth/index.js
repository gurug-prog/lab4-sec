'use strict';

const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const onFinished = require('on-finished');
const bodyParser = require('body-parser');
const path = require('path');

const { SessionStorage } = require('./session-storage')
const auth = require('./auth');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const SESSION_KEY = 'Authorization';
const sessions = new SessionStorage();

app.use((req, res, next) => {
  let currentSession = {};
  let sessionId = req.get(SESSION_KEY);

  if (sessionId) {
    currentSession = sessions.get(sessionId);
    if (!currentSession) {
      currentSession = {};
      sessionId = sessions.init(res);
    }
  } else {
    sessionId = sessions.init(res);
  }

  req.session = currentSession;
  req.sessionId = sessionId;

  onFinished(req, () => {
    const currentSession = req.session;
    const sessionId = req.sessionId;
    sessions.set(sessionId, currentSession);
  });

  next();
});

app.get('/', async (req, res) => {
  console.log('GET /')
  if (req.session.access_token) {
    const tokenLifetime = req.session.expires_at - Math.floor(Date.now() / 1000);
    if (tokenLifetime <= process.env.TOKEN_REFRESH_LIFETIME) {
      const response = await auth.auth0LoginRefreshToken(req.session.refresh_token);
      const responseObj = JSON.parse(response);
      req.session.access_token = responseObj.access_token;
      req.session.expires_at = Math.floor(Date.now() / 1000) + responseObj.expires_in;
    }

    return res.json({
      username: req.session.username,
      logout: 'http://localhost:3000/logout'
    });
  }

  res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/logout', (req, res) => {
  sessions.destroy(req, res);
  res.redirect('/');
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const response = await auth.auth0Login(login, password);
    const responseObj = JSON.parse(response);
    if (responseObj) {
      console.log(response);

      req.session.username = login;
      req.session.login = login;
      req.session.access_token = responseObj.access_token;
      req.session.expires_at = Math.floor(Date.now() / 1000) + responseObj.expires_in;
      req.session.refresh_token = responseObj.refresh_token;

      res.json({ token: req.sessionId });
    }
  } catch (error) {
    console.error(error);
  }

  res.status(401).send();
});

app.listen(process.env.PORT, () => {
  console.log(`App listening on port ${process.env.PORT}`)
});
