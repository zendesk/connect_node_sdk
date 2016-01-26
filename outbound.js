var D = function(a){function b(a){j(function(){throw a})}function c(b){return this.then(b,a)}function d(b){return this.then(a,b)}function e(b,c){return this.then(function(a){return k(b)?b.apply(null,l(a)?a:[a]):t.onlyFuncs?a:b},c||a)}function f(a){function b(){a()}return this.then(b,b),this}function g(a){return this.then(function(b){return k(a)?a.apply(null,l(b)?b.splice(0,0,void 0)&&b:[void 0,b]):t.onlyFuncs?b:a},function(b){return a(b)})}function h(c){return this.then(a,c?function(a){throw c(a),a}:b)}function i(a,b){var c=o(a);if(1===c.length&&l(c[0])){if(!c[0].length)return t.fulfilled([]);c=c[0]}var d=[],e=t(),f=c.length;if(f)for(var g=(function(a){c[a]=t.promisify(c[a]),c[a].then(function(g){a in d||(d[a]=b?c[a]:g,--f||e.resolve(d))},function(g){a in d||(b?(d[a]=c[a],--f||e.resolve(d)):e.reject(g))})}),h=0,i=f;i>h;h++)g(h);else e.resolve(d);return e.promise}var j,k=function(a){return"function"==typeof a},l=function(a){return Array.isArray?Array.isArray(a):a instanceof Array},m=function(a){return!(!a||!(typeof a).match(/function|object/))},n=function(b){return b===!1||b===a||null===b},o=function(a,b){return[].slice.call(a,b)},p="undefined",q=typeof TypeError===p?Error:TypeError;if(typeof process!==p&&process.nextTick)j=process.nextTick;else if(typeof MessageChannel!==p){var r=new MessageChannel,s=[];r.port1.onmessage=function(){s.length&&s.shift()()},j=function(a){s.push(a),r.port2.postMessage(0)}}else j=function(a){setTimeout(a,0)};var t=function(b){function i(){if(0!==s){var a,b=u,c=0,d=b.length,e=~s?0:1;for(u=[];d>c;c++)(a=b[c][e])&&a(p)}}function l(a){function b(a){return function(b){return c?void 0:(c=!0,a(b))}}var c=!1;if(s)return this;try{var d=m(a)&&a.then;if(k(d)){if(a===v)throw new q("Promise can't resolve itself");return d.call(a,b(l),b(o)),this}}catch(e){return b(o)(e),this}return r(function(){p=a,s=1,i()}),this}function o(a){return s||r(function(){try{throw a}catch(b){p=b}s=-1,i()}),this}var p,r=(a!==b?b:t.alwaysAsync)?j:function(a){a()},s=0,u=[],v={then:function(a,b){var c=t();return u.push([function(b){try{n(a)?c.resolve(b):c.resolve(k(a)?a(b):t.onlyFuncs?b:a)}catch(d){c.reject(d)}},function(a){if((n(b)||!k(b)&&t.onlyFuncs)&&c.reject(a),b)try{c.resolve(k(b)?b(a):b)}catch(d){c.reject(d)}}]),0!==s&&r(i),c.promise},success:c,error:d,otherwise:d,apply:e,spread:e,ensure:f,nodify:g,rethrow:h,isPending:function(){return!(0!==s)},getStatus:function(){return s}};return v.toSource=v.toString=v.valueOf=function(){return p===a?this:p},{promise:v,resolve:l,fulfill:l,reject:o}};t.deferred=t.defer=t,t.nextTick=j,t.alwaysAsync=!0,t.onlyFuncs=!0,t.resolved=t.fulfilled=function(a){return t(!0).resolve(a).promise},t.rejected=function(a){return t(!0).reject(a).promise},t.wait=function(a){var b=t();return setTimeout(b.resolve,a||0),b.promise},t.delay=function(a,b){var c=t();return setTimeout(function(){try{c.resolve(a.apply(null))}catch(b){c.reject(b)}},b||0),c.promise},t.promisify=function(a){return a&&k(a.then)?a:t.resolved(a)},t.all=function(){return i(arguments,!1)},t.resolveAll=function(){return i(arguments,!0)},t.nodeCapsule=function(a,b){return b||(b=a,a=void 0),function(){var c=t(),d=o(arguments);d.push(function(a,b){a?c.reject(a):c.resolve(arguments.length>2?o(arguments,1):b)});try{b.apply(a,d)}catch(e){c.reject(e)}return c.promise}};return t;}();

var _ = require('underscore');
var pkg = require('./package.json');

var BASE_URL = "https://api.outbound.io/v2";
var VERSION = pkg.version;

var APNS = "apns";
var GCM = "gcm";

var API_KEY = "";

function headers() {
    return {
        'Content-type': 'application/json',
        'X-Outbound-Client': 'Javascript-Node/' + VERSION,
        'X-Outbound-Key': API_KEY
    };
}

function error(msg, receivedCall) {
    return {
        'receivedCall': receivedCall || false,
        'message': msg
    }
}

function userObject(info) {
    if (!info) {
      return;
    }
    // create a data object to store top level attributes
    // only these properties can be sent in as top level
    // everything else should be in attributes {} object
    var data = {
      first_name: info.firstName,
      last_name: info.lastName,
      email: info.email,
      phone_number: info.phoneNumber,
      group_id: info.groupId,
      group_attributes: info.groupAttributes,
      previous_id: info.previousId
    };

    // only add attributes if attributes exist
    if (info.attributes) {
      data.attributes = info.attributes;
    }

    // apns & gcm are each required as an array of strings
    if (info.apnsTokens) {
      if (typeof info.apnsTokens === 'string') {
          info.apnsTokens = [info.apnsTokens];
      }
      if (Object.prototype.toString.call(info.apnsTokens) === '[object Array]') {
          data.apns = info.apnsTokens;
      }
    }
    if (info.gcmTokens) {
      if (typeof info.gcmTokens === 'string') {
          info.gcmTokens = [info.gcmTokens];
      }
      if (Object.prototype.toString.call(info.gcmTokens) === '[object Array]') {
          data.gcm = info.gcmTokens;
      }
    }

    // in order to send less useless data
    // pick out all the undefined properties
    data = _.pick(data, function(attribute){
        return !_.isUndefined(attribute);
    });

    return data;
}

function post(endpoint, data, deferred) {
    if (typeof module !== 'undefined') {
        var request = require('request');
        request(
            {
                url: BASE_URL + endpoint,
                method: 'POST',
                headers: headers(),
                json: data
            },
            function (err, response, body) {
                if (err) {
                    deferred.reject(error(err.Error, false));
                } else if(response.statusCode >= 200 && response.statusCode < 400) {
                    deferred.resolve();
                } else {
                    deferred.reject(error(body, true));
                }
            }
        );
    } else {
        var request = new XMLHttpRequest();
        request.open('POST', BASE_URL + endpoint, true);
        var requestHeaders = headers();
        for (var header in requestHeaders) {
            request.setRequestHeader(header, requestHeaders[header]);
        }

        request.onload = function() {
            resp = request.responseText;
            if (request.status >= 200 && request.status < 400){
                deferred.resolve();
            } else {
                deferred.reject(error(resp, true));
            }
        };
        request.onerror = function() {
            deferred.reject(error(null, false));
        };
        request.send(JSON.stringify(data));
    }
}

function getUserIdError(userId) {
    var typeofUserId = typeof userId;
    if (typeofUserId != "number" && typeofUserId != "string") {
        return error("Invalid user ID. Expected string or number, got " + typeofUserId, false);
    }
    return null;
}

function getTokenError(token) {
    var typeofToken = typeof token;
    if (typeofToken != "string") {
        return error("Invalid token. Expected string, got " + typeofToken, false);
    }
    return null;
}

function getEventError(event) {
    var typeofEvent = typeof event;
    if (typeofEvent != "string") {
        return error("Invalid event. Expected string, got " + typeofEvent, false);
    }
    return null;
}

function subscription(userId, unsubscribe, all, campaignIds) {
    var deferred = D();

    var arrayType = Object.prototype.toString.call([]);
    var userIdError = getUserIdError(userId);
    if (userIdError) {
        deferred.reject(userIdError);
    } else if (!all && (Object.prototype.toString.call(campaignIds) != arrayType || campaignIds.length == 0)) {
        deferred.reject(error("At least one campaign ID required."));
    } else {
        requestData = {"user_id": userId}
        if (!all) {
            requestData["campaign_ids"] = campaignIds;
        }
        url = '/' + (unsubscribe ? 'unsubscribe' : 'subscribe') + '/' + (all ? 'all' : 'campaigns');
        post(url, requestData, deferred);
    }
    return deferred.promise;
}

function deviceToken(platform, register, userId, token) {
    var deferred = D();

    var userIdError = getUserIdError(userId);
    var tokenError = getTokenError(token);
    if (userIdError) {
        deferred.reject(userIdError);
    } else if (tokenError) {
        deferred.reject(tokenError);
    } else {
        requestData = {"user_id": userId, "token": token}
        post('/' + platform + '/' + (register ? 'register' : 'disable'), requestData, deferred);
    }
    return deferred.promise;
}

function Outbound(thisApiKey) {
    API_KEY = thisApiKey;
}

Outbound.prototype.unsubscribeAll = function(userId) {
    return subscription(userId, true, true, null);
};

Outbound.prototype.unsubscribeCampaigns = function(userId, campaignIds) {
    return subscription(userId, true, false, campaignIds);
};

Outbound.prototype.subscribeAll = function(userId) {
    return subscription(userId, false, true, null);
};

Outbound.prototype.subscribeCampaigns = function(userId, campaignIds) {
    return subscription(userId, false, false, campaignIds);
};

Outbound.prototype.identify = function(userId, attributes) {
    var deferred = D();

    var userIdError = getUserIdError(userId);
    if (userIdError) {
        deferred.reject(userIdError);
    } else {
        requestData = {"user_id": userId};
        user = userObject(attributes);
        for (var attr in user) {
            requestData[attr] = user[attr];
        }
        post('/identify', requestData, deferred);
    }
    return deferred.promise;
};

Outbound.prototype.track = function(userId, event, properties, timestamp) {
    var deferred = D();

    var userIdError = getUserIdError(userId);
    var eventError = getEventError(event);

    if (userIdError) {
        deferred.reject(userIdError);
    } else if (eventError) {
        deferred.reject(eventError);
    } else {
        requestData = {"user_id": userId, "properties": {}, "event": event};

        if (timestamp){
          requestData.timestamp = timestamp;
        } else {
          requestData.timestamp = Math.floor(Date.now() / 1000);
        }

        if (properties && typeof properties === 'object') {
            requestData.properties = properties;
        }

        post('/track', requestData, deferred);
    }

    return deferred.promise;
};

Outbound.prototype.trackBatch = function(events) {
    var deferred = D();
    var userIdError;
    var eventError;

    if (!Array.isArray(events)) {
        deferred.reject(error("Invalid events array. Expected array, got " + (typeof events), false));
    } else {
        if (events.length > 100) {
            deferred.reject(error("Events array can not contain more than 100 events. Got " + events.length, false));
        } else {
            for (var i = 0, len = events.length; i < len; i++) {
                // validate user_id and event in each event
                userIdError = getUserIdError(events[i].user_id);
                if (userIdError) {
                    deferred.reject(userIdError);
                    return deferred.promise;
                } else {
                    eventError = getEventError(events[i].event);
                    if (eventError) {
                        deferred.reject(eventError);
                        return deferred.promise;
                    }
                }
            }

            post('/track/batch', events, deferred);
        }
    }

    return deferred.promise;
};

Outbound.prototype.registerApnsToken = function(userId, token) {
    return deviceToken(APNS, true, userId, token);
};

Outbound.prototype.registerGcmToken = function(userId, token) {
    return deviceToken(GCM, true, userId, token);
};

Outbound.prototype.disableApnsToken = function(userId, token) {
    return deviceToken(APNS, false, userId, token);
};

Outbound.prototype.disableGcmToken = function(userId, token) {
    return deviceToken(GCM, false, userId, token);
};

module.exports = Outbound;
