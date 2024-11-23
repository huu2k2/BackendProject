import Redis from 'ioredis';

// Sử dụng URI từ Redis Cloud
const redis = new Redis('redis://default:cMKrz4c1UWt9fsj8GxNkcl8UAkAAEUUJ@redis-12772.c85.us-east-1-2.ec2.redns.redis-cloud.com:12772');

redis.on('connect', () => {
  console.log('Connected to Redis Cloud');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

export default redis;
