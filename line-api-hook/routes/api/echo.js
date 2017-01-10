(function(module) {

  const WebhookRequest = require('../common/line/webhook-request.js');
  const LineReply = require('../common/line/reply-api.js');
  const CHANNEL_SECRET_KEY = process.env.ECHO_LINE_CHANNEL_SECRET_KEY;
  const CHANNEL_ACCESS_TOKEN = process.env.ECHO_LINE_CHANNEL_ACCESS_TOKEN;

  const routeUrl = function(router) {
    router.get('/echo', function(req, res, next) {
      res.json({"code": 0, "message": "I'm alive now"});
    });

    router.post('/echo', function(req, res, next) {
      // As Webhook API spec, we have to return 200 OK response
      res.sendStatus(200);

      try {
        if (!WebhookRequest.isValid(req, CHANNEL_SECRET_KEY)) {
          console.error("Bad request : \n" +
                        'Requested header : ' + JSON.stringify(req.headers) + "\n" +
                        'Requested data : ' + JSON.stringify(req.body));
          return next();
        }

        for (let i = 0, l = req.body.events.length; i < l; i++) {
          let webhookRequest = new WebhookRequest(req.body.events[i]);

          if (!webhookRequest.isTextMessage()) {
            continue;
          }

          // make messages
          var messages = [
            {
              "type": "text",
              "text": webhookRequest.getTextMessage()
            }
          ];

          let lineReply = new LineReply(CHANNEL_ACCESS_TOKEN);
          lineReply.sendReplyAsync(webhookRequest.getReplyToken(), messages);
        }

      } catch(e) {
        console.error("Internal Server Error : \n" +
                      'Requested header : ' + JSON.stringify(req.headers) + "\n" +
                      'Requested data : ' + JSON.stringify(req.body) + "\n" +
                      e);
      }
    });

    return router;
  };

  module.exports = routeUrl;

})(module);
