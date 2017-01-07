(function(module) {

  var util = require('util');

  util.clone = function(o) {
    return JSON.parse(JSON.stringify(o));
  };

  module.exports = util;
})(module);
