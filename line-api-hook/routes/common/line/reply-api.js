(function(module) {

  const https = require('https');
  const customUtil = require('../custom-util.js');
  const replyApiConfigTemplate = require('./reply-api-config.json');

  const replyAPI = function(channelAccessToken) {
    this.channelAccessToken = channelAccessToken;
    this.replyApiConfig = customUtil.clone(replyApiConfigTemplate);
    this.replyApiConfig.postOption.headers.Authorization =
      this.replyApiConfig.postOption.headers.Authorization.replace('{CHANNEL_ACCESS_TOKEN}', channelAccessToken);
  };

  replyAPI.prototype.sendReplyAsync = function(replyToken, messages) {
    const postRequest = https.request(this.replyApiConfig.postOption, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) { console.log('Posting chunk to LINE Reply API : ' + chunk); });
    });

    postRequest.on('error', function(error) {
      console.log(error);
    });

    const sendData = {
      replyToken: replyToken,
      messages: messages
    };
    postRequest.write(JSON.stringify(sendData));
    postRequest.end();
  };

  module.exports = replyAPI;
})(module);
