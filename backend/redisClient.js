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
  url: 'https://fein.upstash.io',
  token: 'AcZDFkNzYOURTOKENQxYTM3NTk=',
});


module.exports = redisClient;
