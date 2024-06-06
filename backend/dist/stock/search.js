const express = require('express');
const admin = require('C:/Users/Enoch Cobbina/Desktop/mern-firebase-auth/backend/firebaseAdmin.js');
const redisClient = require('C:/Users/Enoch Cobbina/Desktop/mern-firebase-auth/backend/redisClient');
//const Redis = require('@upstash/redis');

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
router.post('/stock-search', verifyFirebaseToken, async (req, res) => {
  const { query } = req.body;
  const cacheKey = `${query}`;

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
        query,
      })
    };

    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://api.bavest.co/v0/search', options);
    const data = await response.json();
    await redisClient.setex(cacheKey, 1800, JSON.stringify(data)); // Cache for 30 mins
    res.json(data);
  } catch (err) {
    console.error('Error retrieving stock data:', err);
    res.status(500).send('Error retrieving stock data');
  }
});

module.exports = router;