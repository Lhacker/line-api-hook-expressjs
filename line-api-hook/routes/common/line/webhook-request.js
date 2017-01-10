(function(module) {

  const crypto = require("crypto");

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
        this.postback = event.postback;
        break;
      case 'beacon':
        this.beacon = beacon;
      default:
        break;
    }
  };

  webhookRequest.isValid = function(req, channelSecretKey) {
    return req.headers['x-line-signature'] ===
      crypto.createHmac('sha256', channelSecretKey).update(new Buffer(JSON.stringify(req.body), 'utf8')).digest('base64');
  };

  webhookRequest.prototype.fromUser = function() { return this.source.type === 'user'; };

  webhookRequest.prototype.fromGroupChat = function() { return this.source.type === 'group'; };

  webhookRequest.prototype.fromRoomChat = function() { return this.source.type === 'room'; };

  webhookRequest.prototype.isMessageType = function() { return this.type === 'message'; };

  webhookRequest.prototype.isFollowMessage = function() { return this.type === 'follow'; };

  webhookRequest.prototype.isUnfollowMessage = function() { return this.type === 'unfollow'; };

  webhookRequest.prototype.isJoinMessage = function() { return this.type === 'join'; };

  webhookRequest.prototype.isLeaveMessage = function() { return this.type === 'leave'; };

  webhookRequest.prototype.isPostBackedMessage = function() { return this.type === 'postback'; };

  webhookRequest.prototype.isTextMessage = function() { return this.isMessageType() && this.message.type === 'text'; };

  webhookRequest.prototype.isImageMessage = function() { return this.isMessageType() && this.message.type === 'image'; };

  webhookRequest.prototype.isVideoMessage = function() { return this.isMessageType() && this.message.type === 'video'; };

  webhookRequest.prototype.isStickerMessage = function() { return this.isMessageType() && this.message.type === 'sticker'; };

  webhookRequest.prototype.isLocationMessage = function() { return this.isMessageType() && this.message.type === 'location'; };

  webhookRequest.prototype.getReplyToken = function() { return this.replyToken; }

  webhookRequest.prototype.getSourceUserId = function() {
    if (!this.fromUser()) { return ''; }
    return this.source.userId;
  }

  webhookRequest.prototype.getSourceGroupId = function() {
    if (!this.fromGroupChat()) { return ''; }
    return this.source.groupId;
  }

  webhookRequest.prototype.getSourceRoomId = function() {
    if (!this.fromRoomChat()) { return ''; }
    return this.source.roomId;
  }

  webhookRequest.prototype.getTextMessage = function() {
    if (!this.isTextMessage()) { return ''; }
    return this.message.text;
  }

  webhookRequest.prototype.getLocationMessage = function() {
    if (!this.isLocationMessage()) { return {}; }
    return this.message.location;
  }

  webhookRequest.prototype.getPostBackedData = function() {
    if (!this.isPostBackedMessage()) { return ''; }
    return this.postback.data;
  }

  module.exports = webhookRequest;
})(module);
