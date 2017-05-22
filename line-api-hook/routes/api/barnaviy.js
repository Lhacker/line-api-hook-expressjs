(function(module) {

  const WebhookRequest = require('../common/line/webhook-request.js');
  const LineReply = require('../common/line/reply-api.js');
  const redisClient = require('../common/redis-client.js');
  const requestPromise = require('../common/request-promise.js');
  const CHANNEL_SECRET_KEY = process.env.BARNAVIY_LINE_CHANNEL_SECRET_KEY;
  const CHANNEL_ACCESS_TOKEN = process.env.BARNAVIY_LINE_CHANNEL_ACCESS_TOKEN;
  const BAR_NAVI_API_KEY = process.env.BAR_NAVI_API_KEY;

  /**
   * functions
   */

  function parseAsQueryString(callerUrl, query) {
    var queryString = '&format=json';
    queryString += '&pattern=1';
    queryString += `&url=${encodeURIComponent(callerUrl)}`;
    queryString += `&lat=${query.lat}&lng=${query.lng}`;
    queryString += `&range=1000&datum=tokyo`;

    if (!!query.barType) {
      queryString += query.barType.sprit(',').forEach(function(typeNumber, i) {
        return `&type=${typeNumber}`;
      }
    }
    if (!!query.barName) {
      queryString += `&name=${query.barName}`;
    }

    return queryString;
  }

  function searchBarAsync(callerUrl, userId, resolve, reject) {
    redisClient.hgetallAsync(userId)
      .then(function(query) {
        var barNaviRequestUrl = parseAsQueryString(callerUrl, query);
        return requestPromise.httpsRequest(option);
      })
      .then(function(queryString) {
        // FIXME: fix mock data
        var searchResult = {
          api_version: 2,
          results_available: 300,
          results_returned: 40,
          results_start: 1,
          shops: [
          ]
        };
        resolve(searchResult);
      })
      .catch(reject);
  }

  function replySearchResult(replyToken, barData) {
    var messages = barData.shops.forEach(function(i, bar) {
      {
        type: 'location',
        title: `${bar.name} : ${bar.type}`,
        address: `${bar.address}, ${bar.badget}, ${bar.open}, ${bar.close}`,
        latitude: bar.lat_tokyo,
        longitude: bar.lng_tokyo
      }
    });

    let lineReply = new LineReply(CHANNEL_ACCESS_TOKEN);
    lineReply.sendReplyAsync(replyToken, messages);
  }

  /**
   * routes
   */
  const routeUrl = function(router) {
    router.get('/barnaviy', function(req, res, next) {
      res.json({"code": 0, "message": "I'm alive now"});
    });

    router.post('/barnaviy', function(req, res, next) {
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

          if (!webhookRequest.isMessage()) {
            continue;
          }

          // handle user action
          if (webhookRequest.isLocationMessage()) {
            
          } else if (webhookRequest.isTextMessage()) {
          
          } else if (webhookRequest.isPostBackedMessage() &&
            webhookRequest.getPostBackedData() == 'okaytosearch') {
            var callerUrl = `${req.protocol}://${req.get('Host')}${req.url}`;
            new Promise(function(resolve, reject) {
              searchBarAsync(callerUrl, webhookRequest.getUserId(), function(barData) {
                // FIXME judge api error
                if (false) {
                } else {
                  resolve(barData);
                }
              });
            ).then(function(barData) {
              replySearchResult(webhookRequest.getReplyToken(), barData);
            }).catch(function(e) {
              new LineReply(CHANNEL_ACCESS_TOKEN)
                .sendReplyAsync(webhookRequest.getReplyToken(), { type: 'text', text: e });
            });
          }
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
