(function(module) {

  const requestPromise = require('../request-promise.js');
  const customUtil = require('../custom-util.js');
  const replyApiConfigTemplate = require('./reply-api-config.json');

  const replyAPI = function(channelAccessToken) {
    this.channelAccessToken = channelAccessToken;
    this.replyApiConfig = customUtil.clone(replyApiConfigTemplate);
    this.replyApiConfig.postOption.headers.Authorization =
      this.replyApiConfig.postOption.headers.Authorization.replace('{CHANNEL_ACCESS_TOKEN}', channelAccessToken);
  };

  replyAPI.prototype.sendReplyAsync = function(replyToken, messages) {
    const sendData = JSON.stringify({
      replyToken: replyToken,
      messages: messages
    });

    requestPromise.httpsRequest(this.replyApiConfig.postOption, sendData)
      .then(function(res) {
        console.log(`replied : ${sendData}`);
      })
      .catch(function(e) {
        console.error(error);
      });
  };

  module.exports = replyAPI;
})(module);
