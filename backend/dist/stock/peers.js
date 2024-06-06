//provide list of similar stocks based on the stock symbol ie. recommendations
const express = require('express');
const admin = require('C:/Users/Enoch Cobbina/Desktop/mern-firebase-auth/backend/firebaseAdmin.js');//change file location
const redisClient = require('C:/Users/Enoch Cobbina/Desktop/mern-firebase-auth/backend/redisClient');

const router = express.Router();

// Middleware to verify Firebase ID tokens
const verifyFirebaseToken = async (req, res, next) => {
  const idToken = req.headers.authorization && req.headers.authorization.split('Bearer ')[1];

  if (!idToken) {
    return res.status(401).send('Unauthorized');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (err) {
    console.error('Error verifying ID token:', err);
    res.status(403).send('Unauthorized');
  }
};

// Route to handle stock data requests with Firebase token verification
router.post('/peers', verifyFirebaseToken, async (req, res) => {
  const { symbol } = req.body;
  const cacheKey = `${symbol}`;

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.send(cachedData); // Return the cached data as-is
    }

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-key': 'FMp8UUGfXQ1MqgsP2JkyOoGRNFX5kvM2bQHw3FNg'
      },
      body: JSON.stringify({
        symbol
      })
    };

    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://api.bavest.co/v0/stock/peers', options);
    const data = await response.json();
    await redisClient.setex(cacheKey, 1800, JSON.stringify(data)); // Cache for 30 mins
    res.json(data);
  } catch (err) {
    console.error('Error retrieving peers data:', err);
    res.status(500).send('Error retrieving peers data');
  }
});

module.exports = router;
