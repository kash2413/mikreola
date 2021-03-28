/*
   detikLiveUserCounterResponse Object for Core-Developers
*/

// Chapter 1: Beginning
if (typeof jQuery !== 'function') {
  var warnJQueryUndefinedStr = 'detikLiveUserCounterResponse.js needs jQuery 1.1x.x to run properly!';
  console.log(warnJQueryUndefinedStr);
  throw new Error(warnJQueryUndefinedStr); // this line will stop the script
};

// Chapter 2: Load External Libraries
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

// Chapter 3: detikLiveUserCounterResponse Context as ctx
var detikLiveUserCounterResponse = {};

(function(ctx) {

  ctx.headerInfo = '[detikLiveUserCounterResponse]';
  ctx.version    = 'v1.9';

  ctx.config = {
    enableConsoleLog: false,
    timeInterval: 10000,
    channel: 'counterview',
    domain: window.location.hostname,
    user: '',
    trackerid: '',
    enableGetCounter: true,
    getCounterUrl: 'https://parsley.detik.com/dtnct',
    getCounterReadOnlyUrl: 'https://parsley.detik.com/dtnctv',
    successCallback: null,
    errorCallback: null,
    enableTheTracker: false,
    theTrackerUrl: 'https://cdn.detik.net.id/loganalysistracker/thetracker-detik-v3.min.js',
    persistentMode: true,
    userPrefix: 'gen_',
    dtmaCookieName: '__dtma',
    dtklucCookieName: 'dtkluc',
    dtklucCookieAttribute: { expires: 365 }, // satuan expires adalah Hari
    startDelay: 6000,
    startDelayForResponse: 1000, // parent
    startDelayForRequest: 2000, // embed
    readOnly: false,
    requestWinPostMsg: false,
    responseWinPostMsg: true,
    requestWinPostData: { dtklucreq: 1 },
    responseWinPostData: { dtklucuser: null, dtkluctrackerid: null, dtklucdomain: null, dtklucchannel: null },
    requestWinPostTargetWindow: '*',
    responseWinPostTargetWindow: '*',
    winPostDataRewriteUserId: true,
    winPostDataRewriteTrackerId: true,
    winPostDataRewriteDomain: true,
    winPostDataRewriteChannel: false,
    waitingResponseWinPostMsg: 3000,
    ajaxSetupCache: false,
    ajaxSetupASync: true,
    noHit: true
  };

  ctx.inputConfig = {};

  ctx.vars = {
    timeIntervalHandler: null,
    getCounterData: null,
    isTheTrackerHasBeenLoaded: false,
    startDelayNow: false,
    messageAddListenerLock: false,
    dataWinPostMsgIsOK: false,
    haltedRequestWinPostMsg: false,
    firstStart: false,
    playIsSent: false,
    playIsOccur: false
  };

  ctx.log = function(txtLog, txtVal) {
    if (ctx.config.enableConsoleLog === true) {
      if (((typeof txtVal) === 'undefined') || (txtVal === null)) {
        console.log(ctx.headerInfo + ' ' + txtLog);
      } else {
        console.log(ctx.headerInfo + ' ' + txtLog, txtVal);
      }
    }
  };

  ctx.uniqueId = function (prefix) {
    // https://gist.github.com/gordonbrander/2230317
    // NOTE: This format of 8 chars, followed by 3 groups of 4 chars, followed by 12 chars
    //       is known as a UUID and is defined in RFC4122 and is a standard for generating unique IDs.
    //       This function DOES NOT implement this standard. It simply outputs a string
    //       that looks similar. The standard is found here: https://www.ietf.org/rfc/rfc4122.txt
    if (prefix === null) {
      prefix = '_';
    }
    function chr4(){
      return Math.random().toString(16).slice(-4);
    }
    return prefix + chr4() + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() +
      '-' + chr4() + chr4() + chr4();
  };

  ctx.configProcess = function() {
    $.each(ctx.config, function (idx, val) {
      if (((typeof ctx.inputConfig) !== 'undefined') && (ctx.inputConfig !== null)) {
        if ((typeof ctx.inputConfig[idx]) !== 'undefined') {
          ctx.config[idx] = ctx.inputConfig[idx];
        }
      }
    });
    ctx.log('configProcess config is', ctx.config);
  };

  ctx.setConfig = function(config) {
    if ($.type(config) === 'object') {
      ctx.log('setConfig is working', null);
      ctx.inputConfig = config;
      ctx.configProcess();
      ctx.config.user = ctx.uniqueId(ctx.config.userPrefix);
      if (ctx.config.responseWinPostMsg === true) {
        ctx.config.startDelay = ctx.config.startDelayForResponse;
      }
      if (ctx.config.requestWinPostMsg === true) {
        ctx.config.startDelay = ctx.config.startDelayForRequest;
      }
      ctx.log('setConfig user', ctx.config.user);
      ctx.messageAddListenerInit();
    }
  };

  ctx.getScriptTemplate = function(gsUrl, gsNextFunction, gsStatusOK) {
    $.ajaxSetup( { async: true , cache: true } );
    $.getScript(gsUrl, function() {
      if ((typeof gsStatusOK) === 'function') {
        gsStatusOK();
      }
      if ((typeof gsNextFunction) === 'function') {
        gsNextFunction();
      }
      $.ajaxSetup( { async: true , cache: false } ); // reset ajax config
    }).fail(function() {
      ctx.log('calls failed', gsUrl);
      if ((typeof gsStatusOK) === 'function') {
        gsStatusOK();
      }
      $.ajaxSetup( { async: true , cache: false } ); // reset ajax config
      if ((typeof gsNextFunction) === 'function') {
        gsNextFunction();
      }
    });
  };

  ctx.gsTheTracker = function() {
    if ((ctx.config.enableTheTracker === true) && (ctx.vars.isTheTrackerHasBeenLoaded === false)) {
      ctx.log('gsTheTracker lib caller', null);
      ctx.getScriptTemplate(ctx.config.theTrackerUrl, ctx.start2, null);
    }
  };

  ctx.start2 = function() {
    if ((ctx.config.enableTheTracker === true) && (ctx.vars.isTheTrackerHasBeenLoaded === false)) {
      ctx.vars.isTheTrackerHasBeenLoaded = true;
      ctx.log('start2 is working', null);
      var metas = document.getElementsByTagName("meta");
      try {
        detikTracker.call(null, metas);
        ctx.log('start2 detikTracker call is running', null);
        var dtma = Cookies.get(ctx.config.dtmaCookieName);
        if ((typeof dtma === 'string') && (dtma !== '')) {
          ctx.config.trackerid = dtma;
          ctx.log('start2 got __dtma', ctx.config.trackerid);
          ctx.start1();
        } else {
          if (ctx.config.persistentMode === true) {
            ctx.start1();
          } else {
            ctx.log('start2 didnt get __dtma, halted', null);
          }
        }
      } catch (error) {
        ctx.log('start2 detikTracker call got an error', null);
        if (ctx.config.persistentMode === true) {
          ctx.start1();
        } else {
          ctx.log('start2 didnt get __dtma, halted', null);
        }
      }
    }
  };

  ctx.start1 = function() {
    if (ctx.config.noHit === false) {
      if (ctx.vars.timeIntervalHandler === null) {
        ctx.log('start1 is working', null);
        var domain2 = '';
        try {
          if ((document.referrer !== null) && (document.referrer !== undefined)) {
            var referrer = document.referrer;
            domain2 = (new URL(referrer)).hostname;
          }
        } catch (ex) {
        }
        ctx.vars.getCounterData = 
          'chanel=' + encodeURIComponent(ctx.config.channel) + 
          '&user=' + encodeURIComponent(ctx.config.user) +
          '&trackerid=' + encodeURIComponent(ctx.config.trackerid) +
          '&domain=' + encodeURIComponent(ctx.config.domain) +
          '&domain2=' + encodeURIComponent(domain2);
        //ctx.log('getCounterData', ctx.vars.getCounterData);
        ctx.getCounter(); // first encounter !
        if ((ctx.vars.playIsOccur === true) && (ctx.vars.playIsSent === false)) {
          ctx.getCounter(); // sent immediately play event
        }
        ctx.vars.timeIntervalHandler = setInterval(function() {
          ctx.getCounter();
          if ((ctx.vars.playIsOccur === true) && (ctx.vars.playIsSent === false)) {
            ctx.getCounter(); // sent immediately play event
          }
        }, ctx.config.timeInterval);
      }
    } else {
      ctx.log('start1 uses noHit, only responseWinPostMsg (if it is true) will run in message listener', null);
    }
  };

  ctx.start0 = function() {
    // get dtkluc if failed then use generated userid
    if ((ctx.config.enableTheTracker === true) && (ctx.vars.isTheTrackerHasBeenLoaded === false)) {
      ctx.log('start0 load theTracker to create __dtma', null);
      ctx.gsTheTracker();
    } else {
      ctx.log('start0 read __dtma as trackerid', null);
      var dtma = Cookies.get(ctx.config.dtmaCookieName);
      if ((typeof dtma === 'string') && (dtma !== '')) {
        ctx.config.trackerid = dtma;
        ctx.log('start0 got __dtma, trackerid value is', ctx.config.trackerid);
      }
      ctx.log('start0 read dtkluc', null);
      var dtkluc = Cookies.get(ctx.config.dtklucCookieName);
      if ((typeof dtkluc === 'string') && (dtkluc !== '')) {
        ctx.config.user = dtkluc;
        ctx.log('start0 got dtkluc, user value is', ctx.config.user);
        ctx.start1();
      } else {
        ctx.log('start0 unable to read dtkluc, user value is', ctx.config.user);
        Cookies.set(ctx.config.dtklucCookieName, ctx.config.user, ctx.config.dtklucCookieAttribute);
        ctx.start1();
      }
    }
  };

  ctx.start = function() {
    ctx.log('start is working, version is', ctx.version);
    if (ctx.vars.startDelayNow === false) {
      ctx.vars.startDelayNow = true;
      ctx.log('start uses startDelay', ctx.config.startDelay);
      setTimeout(function() {
        ctx.log('start uses startDelay is over', null);
        ctx.vars.startDelayNow = false;
        if (ctx.config.requestWinPostMsg === true) {
          // get ctx.config.user and ctx.config.domain from parent iframe
          ctx.requestWinPostMsg();
        } else {
          // get dtkluc if failed then use generated userid
          ctx.start0();
        }
      }, ctx.config.startDelay);
    } else {
      ctx.log('start said that startDelay is busy!', null);
    }
  };

  ctx.messageAddListenerInit = function() {
    if (ctx.vars.messageAddListenerLock === false) {
      ctx.log('messageAddListenerInit is working', null);
      ctx.vars.messageAddListenerLock = true;
      if (ctx.config.requestWinPostMsg === true) {
        window.addEventListener('message', function(event) {
          if (ctx.vars.haltedRequestWinPostMsg === false) {
            ctx.log('messageAddListenerInit requestWinPostMsg window listener is working', null);
            var responseData = event.data;
            if ((ctx.config.winPostDataRewriteUserId === true) && (typeof responseData === 'object') && (responseData !== null) && (responseData.hasOwnProperty('dtklucuser')) ) {
              ctx.config.user = responseData.dtklucuser;
              ctx.vars.dataWinPostMsgIsOK = true;
              ctx.vars.haltedRequestWinPostMsg = true;
            }
            if ((ctx.config.winPostDataRewriteTrackerId === true) && (typeof responseData === 'object') && (responseData !== null) && (responseData.hasOwnProperty('dtkluctrackerid')) ) {
              ctx.config.trackerid = responseData.dtkluctrackerid;
            }
            if ((ctx.config.winPostDataRewriteDomain === true) && (typeof responseData === 'object') && (responseData !== null) && (responseData.hasOwnProperty('dtklucdomain')) ) {
              ctx.config.domain = responseData.dtklucdomain;
            }
            if ((ctx.config.winPostDataRewriteChannel === true) && (typeof responseData === 'object') && (responseData !== null) && (responseData.hasOwnProperty('dtklucchannel')) ) {
              ctx.config.channel = responseData.dtklucchannel;
            }
            if (ctx.vars.dataWinPostMsgIsOK === true) {
              ctx.log('messageAddListenerInit requestWinPostMsg got responseData',  responseData);
              setTimeout(function() {
                ctx.start1();
              }, 0);
            }
          }
        });
      }
      if (ctx.config.responseWinPostMsg === true) {
        window.addEventListener('message', function(event) {
          ctx.log('messageAddListenerInit responseWinPostMsg window listener is working', null);
          var requestData = event.data;
          if ((typeof requestData === 'object') && (requestData !== null) && (requestData.hasOwnProperty('dtklucreq') === true) && (requestData.dtklucreq === 1)) {
            var responseData = ctx.config.responseWinPostData;
            responseData.dtklucuser = ctx.config.user;
            responseData.dtkluctrackerid = ctx.config.trackerid;
            responseData.dtklucdomain = ctx.config.domain;
            responseData.dtklucchannel = ctx.config.channel;
            var iframes = document.getElementsByTagName('iframe');
            ctx.log('messageAddListenerInit responseWinPostMsg iframes', iframes);
            $.each(iframes, function(idx, val) {
              try { 
                val.contentWindow.postMessage(responseData, ctx.config.responseWinPostTargetWindow);
                ctx.log('messageAddListenerInit responseWinPostMsg already sent', null);
              } catch (ex) {
                ctx.log('messageAddListenerInit responseWinPostMsg is failed!', null);
              }
            });
          }
        });
      }
    }
  };

  ctx.requestWinPostMsg = function() {
    if (ctx.config.requestWinPostMsg === true) {
      try {
        ctx.log('requestWinPostMsg is working', null);
        window.parent.postMessage(ctx.config.requestWinPostData, ctx.config.requestWinPostTargetWindow);
      } catch (ex) {
        ctx.log('requestWinPostMsg is failed!', null);
      }
      setTimeout(function() {
        if (ctx.vars.dataWinPostMsgIsOK === false) {
          ctx.log('requestWinPostMsg no-more waiting window.postMessage, get cookie now!', null);
          ctx.vars.haltedRequestWinPostMsg = true;
          ctx.start0();
        }
      }, ctx.config.waitingResponseWinPostMsg);
    }
  };

  ctx.getCounter = function() {
    if (ctx.config.enableGetCounter === true) {
      var getCounterUrl = null;
      var ajaxType = null;
      var ajaxContentType = null;
      var ajaxData = null;
      var playingData = '';
      if (ctx.vars.playIsSent === true) {
        playingData = '&event=playing';
      }
      var firstPlayData = '';
      if ((ctx.vars.firstStart === true) && (ctx.vars.playIsOccur === true) && (ctx.vars.playIsSent === false)) {
        ctx.vars.playIsSent = true;
        firstPlayData = '&event=play';
      }
      var firstStartData = '';
      if (ctx.vars.firstStart === false) {
        ctx.vars.firstStart = true;
        firstStartData = '&event=start';
      }
      if (ctx.config.readOnly === true) {
        ajaxType = 'GET';
        ajaxContentType = 'application/x-www-form-urlencoded';
        ajaxData = ctx.vars.getCounterData + firstStartData + firstPlayData + playingData;
        getCounterUrl = ctx.config.getCounterReadOnlyUrl;
      } else {
        ajaxType = 'POST';
        ajaxContentType = 'application/x-www-form-urlencoded';
        ajaxData = ctx.vars.getCounterData + firstStartData + firstPlayData + playingData;
        getCounterUrl = ctx.config.getCounterUrl;
      }
      ctx.log('getCounter is working', getCounterUrl);
      ctx.log('getCounter ajaxData', ajaxData);
      $.ajaxSetup( { async: ctx.config.ajaxSetupASync , cache: ctx.config.ajaxSetupCache } );
      $.ajax({
        type: ajaxType,
        url: getCounterUrl,
        data: ajaxData,
        contentType: ajaxContentType,
        success: function(successMsg) {
          ctx.log('getCounter success-event', successMsg);
          if (typeof ctx.config.successCallback === 'function') {
            ctx.config.successCallback(successMsg);
          }
        },
        error: function(errorMsg) {
          ctx.log('getCounter error-event', errorMsg);
          if (typeof ctx.config.errorCallback === 'function') {
            ctx.config.errorCallback(errorMsg);
          }
        }
      });
    }
  };
  
  ctx.stop = function() {
    if (ctx.vars.timeIntervalHandler !== null) {
      ctx.log('stop is working', null);
      clearInterval(ctx.vars.timeIntervalHandler);
      ctx.vars.timeIntervalHandler = null;
    }
  };

  ctx.pause = function() {
    ctx.log('pause is working', null);
    ctx.config.enableGetCounter = false;
  };

  ctx.resume = function() {
    ctx.log('resume is working', null);
    ctx.config.enableGetCounter = true;
  };

  ctx.play = function() {
    ctx.log('play is working', null);
    ctx.vars.playIsOccur = true;
  };

})(detikLiveUserCounterResponse);

// for using it, please call these lines :
// detikLiveUserCounterResponse.setConfig({ .. });
// detikLiveUserCounterResponse.start();

//autorun config and start

detikLiveUserCounterResponse.setConfig({
  responseWinPostMsg: true,
  noHit: true
});

detikLiveUserCounterResponse.start();

