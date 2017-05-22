(function(module) {

  const redis = require('redis');
  const bluebird = require('bluebird');
  bluebird.promisifyAll(redis.RedisClient.prototype);
  bluebird.promisifyAll(redis.Multi.prototype);

  module.exports = function(port, host, options) {
    return redis.createClient(port, host, options);
  };
})(module);
