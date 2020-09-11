const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});
const sub = redisClient.duplicate();

function fib(index) {
  // if (index < 2) return 1;
  // return fib(index - 1) + fib(index - 2);
  let value1 = 0;
  let value2 = 1;
  let returnVal;
  for(i=2; i<=index; i++) {
    returnVal = value1 + value2;
    value1 = value2;
    value2 = returnVal;   
  }
  console.log('Returing fib value '+returnVal+' for index '+index);
  return returnVal;
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});
sub.subscribe('insert');
