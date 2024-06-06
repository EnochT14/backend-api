/*const redis = require('redis');

const redisClient = redis.createClient();

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.connect().catch(console.error);

module.exports = redisClient;
*/
const { Redis } = require('@upstash/redis');

const redisClient = new Redis({
  url: 'https://fine-raven-50771.upstash.io',
  token: 'AcZTASQgZDFkNzlmNTgtYjNjYi00ODg3LWJkOTctYjAyY2ZkOTE5ODFmMzY3ODVhZjQxYzRjNGI2YWJkNmFlNzcxM2QxYTM3NTk=',
});


module.exports = redisClient;