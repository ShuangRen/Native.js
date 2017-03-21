webpackJsonp([2],{

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _http = __webpack_require__(73);

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

/***/ 73:
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

/***/ 77:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _index = __webpack_require__(78);

	var _index2 = _interopRequireDefault(_index);

	var _request = __webpack_require__(72);

	var _request2 = _interopRequireDefault(_request);

	var _common = __webpack_require__(74);

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
	    name: 'productList',
	    data: {
	        productList: [],
	        page: 1
	    },
	    render: function render() {
	        return _index2.default;
	    },
	    onCreated: function onCreated() {
	        var that = this;
	        _request2.default.send('getlist', {
	            type: 'product',
	            fn: 'nocallback',
	            page: that.data.page,
	            count: 10
	        }, function (res) {
	            that.data.productList = res.data;
	        });
	    },
	    getmore: function getmore() {
	        var that = this;

	        that.data.page++;

	        _request2.default.send('getlist', {
	            type: 'product',
	            fn: 'nocallback',
	            page: that.data.page,
	            count: 10
	        }, function (res) {
	            if (res.count != 0) {
	                that.data.productList = that.data.productList.concat(res.data);
	            }
	        });
	    },
	    goback: function goback() {
	        this.router.goback();
	    }
	}; //yhcmsApp.rem().windowSize().slidebar().cateBar();

/***/ },

/***/ 78:
/***/ function(module, exports) {

	Object.defineProperty(exports, '__esModule', {value: true});exports.default = function (data) {var tmpstr ="<div class='native-container'>"; (function(){tmpstr+="<div class=\"container\"><div class=\"content-container\"><div class=\"list_pro\"><header><h2>产品中心</h2></header><dl class=\"dllist\">";(function(){var xps=0, undefined, item;for(; xps<data.productList.length; xps++){item=data.productList[xps];undefined=xps;tmpstr+="<dd><a href=\"#productDetail?id=";tmpstr+=(item.id);tmpstr+="\"><img src=\"http://demo.yhcms.cn/";tmpstr+=(item.img);tmpstr+="\" width=\"100%\"></a><a href=\"#productDetail?id=";tmpstr+=(item.id);tmpstr+="\">";tmpstr+=(item.title);tmpstr+="</a></dd>";}})();tmpstr+="</dl><div class=\"btns\" n:click=\"getmore\">点击加载更多</div></div><footer class=\"botfooter\"><span></span><p>Demo for Native.js</p></footer></div><header class=\"topheader\"><i class=\"fa fa-angle-left fa-light\" id=\"slideBtn\" n:click=\"goback\"></i><a href=\"javascript:;\"><h1>Demo for Native.js</h1></a></header><div class=\"catelist\"><header class=\"cateheader\"><i class=\"fa fa-angle-left fa-light\" id=\"cateBtn\"></i><a href=\"#\"><h1>产品中心</h1></a></header><div class=\"list\"><header><h2>全部分类</h2><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></header><header><h2>产品分类1级</h2><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></header><dl><dt><a href=\"#\">产品分类2级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dt><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd></dl><dl><dt><a href=\"#\">产品分类2级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dt><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd></dl><header><h2>产品分类1级</h2><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></header><dl><dt><a href=\"#\">产品分类2级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dt><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd></dl><dl><dt><a href=\"#\">产品分类2级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dt><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd><dd><a href=\"#\">产品分类3级</a><a href=\"#\"><i class=\"fa fa-angle-right fa-gray\"></i></a></dd></dl></div></div></div>";})();tmpstr +="</div>"; return tmpstr;}

/***/ }

});