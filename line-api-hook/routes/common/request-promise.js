(function(module) {

  const http = require('http');
  const https = require('https');

  function requestBy(protocol) {
    return function(options, body) {
      return new Promise(function(resolve, reject) {
        var req = protocol.request(options, function(res) {
          res.setEncoding('utf8');
          res.body = '';
          res.on('data', function(chunk) { res.body += chunk; });
          res.on('end', function() {
            if (res.statusCode != 200) {
              reject(`${res.statusCode} - ${res.body}`);
            } else {
              res.body = JSON.parse(res.body);
              resolve(res);
            }
          });
        });

        req.on('error', function(e) {
          reject(e);
        });

        if (!!body) {
          req.write(body);
        }
        req.end();
      });
    };
  }

  module.exports = {
    httpRequest: requestBy(http),
    httpsRequest: requestBy(https)
  };
})(module);
