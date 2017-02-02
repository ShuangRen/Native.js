webpackJsonp([3],{

/***/ 67:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _http = __webpack_require__(68);

	var _http2 = _interopRequireDefault(_http);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    send: function send(apiurl, data, Fn, errFn) {
	        var that = this;
	        var url = void 0;
	        if (apiurl == 'getlist') {
	            url = 'http://demo.yhcms.cn/index.php/Api/' + apiurl;
	        } else {
	            url = 'http://jvma.webzeal.cn/index.php/Api/' + apiurl;
	        }

	        _http2.default.ajax('GET', url, data).then(function (error, res) {
	            if (error) {
	                errFn && errFn(error);
	            } else {
	                if (that.isJson(res)) {
	                    Fn && Fn(JSON.parse(res));
	                } else {
	                    Fn && Fn(res);
	                }
	            }
	        });
	    },

	    isJson: function isJson(res) {
	        var info = true;
	        try {
	            //在此运行代码
	            JSON.parse(res);
	            info = true;
	        } catch (err) {
	            info = false;
	        }

	        return info;
	    }
	};

/***/ },

/***/ 68:
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;"use strict";

	/*
	 *  Copyright 2012-2013 (c) Pierre Duquesne <stackp@online.fr>
	 *  Licensed under the New BSD License.
	 *  https://github.com/stackp/promisejs
	 */
	;(function (exports) {

	    function Promise() {
	        this._callbacks = [];
	    }

	    Promise.prototype.then = function (func, context) {
	        var p;
	        if (this._isdone) {
	            p = func.apply(context, this.result);
	        } else {
	            p = new Promise();
	            this._callbacks.push(function () {
	                var res = func.apply(context, arguments);
	                if (res && typeof res.then === 'function') res.then(p.done, p);
	            });
	        }
	        return p;
	    };

	    Promise.prototype.done = function () {
	        this.result = arguments;
	        this._isdone = true;
	        for (var i = 0; i < this._callbacks.length; i++) {
	            this._callbacks[i].apply(null, arguments);
	        }
	        this._callbacks = [];
	    };

	    function join(promises) {
	        var p = new Promise();
	        var results = [];

	        if (!promises || !promises.length) {
	            p.done(results);
	            return p;
	        }

	        var numdone = 0;
	        var total = promises.length;

	        function notifier(i) {
	            return function () {
	                numdone += 1;
	                results[i] = Array.prototype.slice.call(arguments);
	                if (numdone === total) {
	                    p.done(results);
	                }
	            };
	        }

	        for (var i = 0; i < total; i++) {
	            promises[i].then(notifier(i));
	        }

	        return p;
	    }

	    function chain(funcs, args) {
	        var p = new Promise();
	        if (funcs.length === 0) {
	            p.done.apply(p, args);
	        } else {
	            funcs[0].apply(null, args).then(function () {
	                funcs.splice(0, 1);
	                chain(funcs, arguments).then(function () {
	                    p.done.apply(p, arguments);
	                });
	            });
	        }
	        return p;
	    }

	    /*
	     * AJAX requests
	     */

	    function _encode(data) {
	        var payload = "";
	        if (typeof data === "string") {
	            payload = data;
	        } else {
	            var e = encodeURIComponent;
	            var params = [];

	            for (var k in data) {
	                if (data.hasOwnProperty(k)) {
	                    params.push(e(k) + '=' + e(data[k]));
	                }
	            }
	            payload = params.join('&');
	        }
	        return payload;
	    }

	    function new_xhr() {
	        var xhr;
	        if (window.XMLHttpRequest) {
	            xhr = new XMLHttpRequest();
	        } else if (window.ActiveXObject) {
	            try {
	                xhr = new ActiveXObject("Msxml2.XMLHTTP");
	            } catch (e) {
	                xhr = new ActiveXObject("Microsoft.XMLHTTP");
	            }
	        }
	        return xhr;
	    }

	    function ajax(method, url, data, headers) {
	        var p = new Promise();
	        var xhr = new_xhr(),
	            payload;
	        data = data || {};
	        headers = headers || {};

	        if (!xhr) {
	            p.done(http.ENOXHR, "当前浏览环境不支持ajax");
	            return p;
	        }

	        payload = _encode(data);
	        if (method === 'GET' && payload) {
	            url += '?' + payload;
	            payload = null;
	        }

	        xhr.open(method, url);

	        var content_type = 'application/x-www-form-urlencoded';
	        for (var h in headers) {
	            if (headers.hasOwnProperty(h)) {
	                if (h.toLowerCase() === 'content-type') content_type = headers[h];else xhr.setRequestHeader(h, headers[h]);
	            }
	        }
	        xhr.setRequestHeader('Content-type', content_type);

	        function onTimeout() {
	            p.done(http.ETIMEOUT, "请求超时", xhr);
	            xhr.abort('timeout');
	        }

	        var timeout = http.ajaxTimeout;
	        if (timeout) {
	            var tid = setTimeout(onTimeout, timeout);
	        }

	        xhr.onreadystatechange = function () {
	            if (timeout) {
	                clearTimeout(tid);
	            }
	            if (xhr.readyState === 4) {
	                var err = !xhr.status || (xhr.status < 200 || xhr.status >= 300) && xhr.status !== 304;
	                p.done(err, xhr.responseText, xhr);
	            }
	        };

	        xhr.send(payload);
	        return p;
	    }

	    function _ajaxer(method) {
	        return function (url, data, headers) {
	            return ajax(method, url, data, headers);
	        };
	    }
	    var http = {
	        promise: Promise,
	        join: join,
	        chain: chain,
	        ajax: ajax,
	        get: _ajaxer('GET'),
	        post: _ajaxer('POST'),
	        put: _ajaxer('PUT'),
	        del: _ajaxer('DELETE'),

	        /* Error codes */
	        ENOXHR: 1,
	        ETIMEOUT: 2,

	        /**
	         * Configuration parameter: time in milliseconds after which a
	         * pending AJAX request is considered unresponsive and is
	         * aborted. Useful to deal with bad connectivity (e.g. on a
	         * mobile network). A 0 value disables AJAX timeouts.
	         *
	         * Aborted requests resolve the promise with a ETIMEOUT error
	         * code.
	         */
	        ajaxTimeout: 100000
	    };

	    if (true) {
	        /* AMD support */
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
	            return http;
	        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else {
	        exports.http = http;
	    }
	})(undefined);

/***/ },

/***/ 74:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _index = __webpack_require__(75);

	var _index2 = _interopRequireDefault(_index);

	var _request = __webpack_require__(67);

	var _request2 = _interopRequireDefault(_request);

	var _common = __webpack_require__(69);

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    name: 'productDetail',
	    data: {
	        id: '',
	        item: ''
	    },
	    render: function render() {
	        return _index2.default;
	    },
	    onCreated: function onCreated(query) {
	        var that = this;

	        that.data.id = query.id;

	        _request2.default.send('getcon', {
	            type: 'product',
	            fn: 'nocallback',
	            id: that.data.id
	        }, function (res) {
	            that.data.item = res.data;
	        });
	    },
	    goback: function goback() {

	        this.router.goback();
	    }
	}; //yhcmsApp.rem().windowSize().slidebar().tab();

/***/ },

/***/ 75:
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {value: true});exports.default = function (data) {var tmpstr ="<div class='native-container'>"; (function(){tmpstr+="<div class=\"container\"><div class=\"content-container\"><div class=\"banner\">";if(data.item.pic){tmpstr+="<img src=\"http://demo.yhcms.cn/";tmpstr+=(data.item.pic);tmpstr+="\" width=\"100%\">";}tmpstr+="</div><div class=\"show_pro\"><ul><li class=\"active\">产品详情</li><li>产品参数</li></ul><ul><li><div class=\"cont\">";tmpstr+=(data.item.content);tmpstr+="</div></li><li><dl><dd>产品规格:<span>112</span></dd><dd>产品规格:<span>112</span></dd><dd>产品规格:<span>112</span></dd><dd>产品规格:<span>112</span></dd><dd>产品规格:<span>112</span></dd></dl></li></ul></div><footer class=\"botfooter\"><span></span><p>Demo for Native.js</p></footer></div><header class=\"topheader\"><i class=\"fa fa-angle-left fa-light\" id=\"slideBtn\" n:click=\"goback\"></i><a href=\"#\"><h1>Demo for Native.js</h1></a></header></div>";})();tmpstr +="</div>"; return tmpstr;}

/***/ }

});