(function(module) {

  const redisClient = require('./redis-client.js');

  module.exports = function() {
    return redis.createClient(
      process.env.REDIS_MASTER_PORT,
      process.env.REDIS_MASTER_HOST,
      {}
    );
  };

})(module);
