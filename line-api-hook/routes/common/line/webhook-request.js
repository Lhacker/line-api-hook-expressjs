(function(module) {

  const crypto = require("crypto");

  const CONSTANT = {
    EVENT_TYPE: {
      MESSAGE: 'message',
      FOLLOW: 'follow',
      POSTBACK: 'postback'
    }
  };

  const webhookRequest = function(event) {
    this.replyToken = event.replyToken;
    this.timestamp = event.timestamp;
    this.source = event.source;
    this.type = event.type;
    switch (this.type) {
      case 'message':
        this.message = event.message;
        break;
      case 'postback':
        this.postbackData = event.postback.data;
        break;
      default:
        break;
    }
  };

  webhookRequest.CONSTANT = CONSTANT;

  webhookRequest.isValid = function(req, channelSecretKey) {
    return req.headers['x-line-signature'] ==
      crypto.createHmac('sha256', channelSecretKey).update(new Buffer(JSON.stringify(req.body), 'utf8')).digest('base64');
  }

  module.exports = webhookRequest;
})(module);
