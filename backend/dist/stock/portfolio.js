//totals stock owned and total value of stock owned??
// portfolio.js
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

// Route to handle portfolio value requests
router.post('/portfolio-value', verifyFirebaseToken, async (req, res) => {
  const { portfolio_items, currency } = req.body;
  const cacheKey = `${JSON.stringify(portfolio_items)}-${currency}`;

  try {
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.send(JSON.parse(cachedData));
    }

    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-api-key': 'FMp8UUGfXQ1MqgsP2JkyOoGRNFX5kvM2bQHw3FNg'
      },
      body: JSON.stringify({
        portfolio_items,
        currency
      })
    };

    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://api.bavest.co/v0/portfolio/price', options);
    const data = await response.json();
    await redisClient.setex(cacheKey, 1800, JSON.stringify(data)); // Cache for 30 mins
    res.json(data);
  } catch (err) {
    console.error('Error calculating portfolio value:', err);
    res.status(500).send('Error calculating portfolio value');
  }
});

module.exports = router;
