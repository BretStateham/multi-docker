const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  console.log('Calculating fib for ' + message + ' ...');
  fibval = fib(parseInt(message));
  console.log('Caching fib for ' + message + ' as ' + fibval);
  redisClient.hset('values', message, fibval);
});

sub.subscribe('insert');
