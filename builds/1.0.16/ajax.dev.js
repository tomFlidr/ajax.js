/*!
 * Ajax.JS
 * @author	Tom Flidr | tomflidr(at)gmail(dot)com
 * @url		https://github.com/tomFlidr/ajax.js
 * @licence	https://tomflidr.github.io/ajax.js/LICENSE.md
 * @version	1.0.16
 * @date	2024-12-16
 * @example
 *
 *    var xhr = Ajax.load(<Ajax.cfg.Load>{
 *       url: 'https://tomflidr.github.io/ajax.js/books.json',
 *       method: 'POST', // GET|POST|OPTION|HEAD...
 *       data: { anything: ["to", "serialize"] },
 *       success: (data?: any, statusCode?: number, xhr?: XMLHttpRequest|null, requestId?: number, url?: string, type?: string) => {},
 *       type: 'json', // json|jsonp|xml|html|text
 *       error: (responseText?: string, statusCode?: number, xhr?: XMLHttpRequest|null, errorObj?: Error|null, errorEvent?: Event|null, requestId?: number, url?: string, type?: string) => {},
 *       headers: {},
 *       cache: false,
 *       async: true
 *    });
 *
 */
 
/**
 * @suppress {checkTypes}
 */

(function (undefinedStr, modules) {
	var globalVar;
	if (typeof window != undefinedStr) {
		globalVar = window;
	} else {
		globalVar = typeof global != undefinedStr ? global : {};
		modules = true;
	}
	var Ajax = globalVar.Ajax = globalVar.Ajax || (function (
		w, d,
		readyStateChangeStr, successStr, errorStr,
		responseTextStr, handlersStr, jsonpStr,
		statusStr, jsonpCallbackParamStr, cacheBusterParamNameStr,
		jsonCapStr, beforeStr, abortStr,
		jsonStr, xmlStr, htmlStr,
		textStr, addEventListenerStr, attachEventStr,
		asyncStr, setAttributeStr, toLowerCaseStr,
		autoStr, postStr, getStr,
		sendStr, parseStr, defaultHeadersStr,
		prototypeStr
	) {
		/**
		 * @typedef		JsonpRequest			JsonpRequest driving object.
		 * @property	{string}	url			Full appended &lt;script&gt; tag src attribute value.
		 * @property	{number}	id			Request id.
		 * @property	{Function}	abort		Function to abort JSONP request.
		*/
		
		/**
		 * @typedef		Ajax
		 * @access		public
		 * @description	Ajax library definition.
		*/
		var Ajax = function Ajax() { };
		/**
		 * @summary		Global handlers storrages, callbacks used before and after each request or in each request abort.
		 * @access		public
		 * @type		{object}
		*/
		Ajax[handlersStr] = {
			'before': [],
			'success': [],
			'abort': [],
			'error': []
		};
		/**
		 * @summary		Request HTTP headers sended by default with each request except JSONP request type.
		 * @access		public
		 * @type		{object}
		*/
		Ajax[defaultHeadersStr] = {
			'X-Requested-With': 'XmlHttpRequest',
			'Content-Type': 'application/x-www-form-urlencoded'
		};
		/**
		 * @summary		JSONP callback GET param default name with value: 'callback'.
		 * @access		public
		 * @type		{string}
		*/
		Ajax[jsonpCallbackParamStr] = 'callback';
		/**
		 * @summary		Cache buster param name, default `_`.
		 * @access		public
		 * @type		{string}
		*/
		Ajax[cacheBusterParamNameStr] = '_';
		Ajax._scriptCallbackTmpl = 'JsonpCallback';
		Ajax._requestCounter = 0;
		/**
		 * @summary					Static method to add global custom callback before any Ajax request type is processed.
		 * @access		public
		 * 
		 * @param		{Function}	callback	Required, default: function (xhr:XMLHttpRequest|null, requestId:number, url:string, type:string) {}. Custom callback called before any Ajax request type. First param is null only for JSONP requests.
		 * 
		 * @return		{Ajax}		Ajax library definition.
		*/
		Ajax.beforeLoad = function (callback) {
			Ajax[handlersStr][beforeStr].push(callback);
			return Ajax;
		};
		/**
		 * @summary					Static method to add global custom callback after any Ajax request type is processed successfully.
		 * @access		public
		 * 
		 * @param		{Function}	callback	Required, default: function (data:object|null, statusCode:number, xhr:XMLHttpRequest|null, requestId:number, url:string, type:string) {}. Custom callback called after any Ajax request type is processed successfully. First param is null only for JSONP requests.
		 * 
		 * @return		{Ajax}		Ajax library definition.
		*/
		Ajax.onSuccess = function (callback) {
			Ajax[handlersStr][successStr].push(callback);
			return Ajax;
		};
		/**
		 * @summary					Static method to add global custom callback after any Ajax request type is aborted.
		 * @access		public
		 * 
		 * @param		{Function}	callback	Required, default: function (xhr:XMLHttpRequest|null, requestId:number, url:string, type:string) {}. Custom callback called after any Ajax request type is aborted. First param is null only for JSONP requests.
		 * 
		 * @return		{Ajax}		Ajax library definition.
		*/
		Ajax.onAbort = function (callback) {
			Ajax[handlersStr][abortStr].push(callback);
			return Ajax;
		};
		/**
		 * @summary					Static method to add global custom callback after any Ajax request type is processed with error.
		 * @access		public
		 * 
		 * @param		{Function}	callback	Required, default: function (xhr:XMLHttpRequest|null, errorObj: Error|null, errorEvent: Event|null, requestId:number, url:string, type:string) {}. Custom callback called after any Ajax request type is processed with error. First param is null only for JSONP requests.
		 * 
		 * @return		{Ajax}		Ajax library definition.
		*/
		Ajax.onError = function (callback) {
			Ajax[handlersStr][errorStr].push(callback);
			return Ajax;
		};
		/**
		 * @summary					Static method to process background GET request with window.XMLHttpRequest. Required param: url:string.
		 * @access		public
		 * 
		 * @param		{string}	url				Required. Url string to send the GET request, relative or absolute.
		 * @param		{object}	data			Not required, default: {}. Object with key/value data to be serialized into query string and sended in url, any complext value will be automaticly stringified by JSON.stringify(), (JSON shim is inclided in this Ajax.js library).
		 * @param		{Function}	successCallback	Not required, default: function (data:object, statusCode:number, xhr:XMLHttpRequest|null, requestId:number, url:string, type:string) {}. Custom callback after everything is done and if response HTTP code is bigger than 199 and lower than 300. Third param is null only for JSONP requests.
		 * @param		{string}	type			Not required, default: ''. Possible values: JSON, JSONP, XML, HTML, TEXT, if not set, result data will be processed/evaluated/parsed by response Content-Type HTTP header.
		 * @param		{Function}	errorCallback	Not required, default: function (responseText:string, statusCode:number, xhr:XMLHttpRequest|null, errorObj: Error|null, errorEvent: Event|null, requestId:number, url:string, type:string) {}. Custom callback after everything is done and if response HTTP code is bigger than 299.
		 * @param		{object}	headers			Not required, default: {}. Custom request HTTP headers to send in request.
		 * @property	{boolean}	cache			Not required, default: false. Use `true` if you don't want to add `_` cache buster param into url.
		 * @param		{boolean}	async			Not required, default: true. Use old synchronized request only if you realy know what you are doing.
		 * 
		 * @return		{XMLHttpRequest|JsonpRequest}		Build in browser request object or JsonpRequest if JSONP request.
		*/
		Ajax[getStr] = function () {
			var ajax = new Ajax();
			return ajax._init.apply(ajax, [].slice.apply(arguments))._processRequest();
		};
		/**
		 * @summary					Static method to process background POST request with window.XMLHttpRequest. Required param: url:string.
		 * @access		public
		 * 
		 * @param		{string}	url				Required. Url string to send the GET request, relative or absolute.
		 * @param		{object}	data			Not required, default: {}. Object with key/value data to be serialized into query string and sended in post request body, any complext value will be automaticly stringified by JSON.stringify(), (JSON shim is inclided in this Ajax.js library).
		 * @param		{Function}	successCallback	Not required, default: function (data:object|null, statusCode:number, xhr:XMLHttpRequest, requestId:number, url:string, type:string) {}. Custom callback after everything is done and if response HTTP code is bigger than 199 and lower than 300.
		 * @param		{string}	type			Not required, default: ''. Possible values: JSON, JSONP, XML, HTML, TEXT, if not set, result data will be processed/evaluated/parsed by response Content-Type HTTP header.
		 * @param		{Function}	errorCallback	Not required, default: function (responseText:string, statusCode:number, xhr:XMLHttpRequest, errorObj: Error|null, errorEvent: Event|null, requestId:number, url:string, type:string) {}. Custom callback after everything is done and if response HTTP code is bigger than 299.
		 * @param		{object}	headers			Not required, default: {}. Custom request HTTP headers to send in request.
		 * @property	{boolean}	cache			Not required, default: false. Use `true` if you don't want to add `_` cache buster param into url.
		 * @param		{boolean}	async			Not required, default: true. Use old synchronized request only if you realy know what you are doing.
		 * 
		 * @return		{XMLHttpRequest}			Build in browser request object.
		*/
		Ajax[postStr] = function () {
			var ajax = new Ajax();
			return ajax._init.apply(ajax, [].slice.apply(arguments))._processRequest(postStr);
		};

		/**
		 * @typedef		RequestConfig			Config to process background GET/POST/JSONP request. Required property: url:string.
		 *
		 * @property	{string}	url			Required. Url string to send the GET request, relative or absolute.
		 * @property	{object}	data		Not required, default: {}. Object with key/value data to be serialized into query string and sended in post request body, any complext value will be automaticly stringified by JSON.stringify(), (JSON shim is inclided in this Ajax.js library).
		 * @property	{Function}	success		Not required, default: function (data:object|null, statusCode:number, xhr:XMLHttpRequest|null, requestId:number, url:string, type:string) {}. Custom callback after everything is done and if response HTTP code is bigger than 199 and lower than 300. Third param is null only for JSONP requests.
		 * @property	{string}	type		Not required, default: ''. Possible values: JSON, JSONP, XML, HTML, TEXT, if not set, result data will be processed/evaluated/parsed by response Content-Type HTTP header.
		 * @property	{Function}	error		Not required, default: function (responseText:string, statusCode:number, xhr:XMLHttpRequest|null, errorObj: Error|null, errorEvent: Event|null, requestId:number, url:string, type:string) {}. Custom callback after everything is done and if response HTTP code is bigger than 299.
		 * @property	{object}	headers		Not required, default: {}. Custom request HTTP headers to send in request.
		 * @property	{boolean}	cache		Not required, default: false. Use `true` if you don't want to add `_` cache buster param into url.
		 * @property	{boolean}	async		Not required, default: true. Use old synchronized request only if you realy know what you are doing.
		*/

		/**
		 * @summary										Process background GET/POST/JSONP request by config. Required param: url:string.
		 * @type		{Ajax}
		 * @access		public
		 *
		 * @param		{RequestConfig}			cfg		Class body definition or nothing. Not required. Empty object by default. Class body definition is plain object and it should containes properties: 'Extend', 'Constructor', 'Static' and anything else to define dynamic element in your class.
		 *
		 * @return		{XMLHttpRequest|JsonpRequest}	Build in browser request object or JsonpRequest if JSONP request.
		*/
		Ajax.load = function (cfg) {
			/// <signature>
			///		<summary>Process background request by config.</summary>
			///		<param name="cfg" type="RequestConfig">Put JS object to process background GET/POST/JSONP request by config. Required property: url:string.</param>
			///		<returns type="XMLHttpRequest|JsonpRequest">Build in browser request object or object if JSONP request.</returns>
			/// </signature>
			var ajax = new Ajax();
			return ajax._init(
				cfg.url, cfg.data, cfg[successStr], cfg.type, cfg[errorStr], cfg.headers, cfg.cache, cfg[asyncStr]
			)._processRequest(cfg.method);
		};
		Ajax[prototypeStr] = {
			'toString': function () {
				return '[object Ajax]';
			},
			_init: function (url, data, success, type, error, headers, cache, async) {
				var fn = function () {}, scope = this;
				scope.url = url || '';
				scope.data = data || {};
				scope.success = success || fn;
				scope.type = type != null ? type[toLowerCaseStr]() : autoStr;
				scope.error = error || fn;
				scope.headers = headers || {};
				scope.cache = cache == null ? !1 : cache;
				scope.async = async == null ? !0 : async;
				scope.result = {
					success: !1, 
					data: {}
				};
				scope.errorEvent = null;
				scope.errorObject = null;
				return scope;
			},
			_processRequest: function (method) {
				var scope = this;
				scope.oldIe = !!d.all;
				if (scope.url.indexOf('&amp;') !== -1)
					scope.url = scope.url.replace(/\&amp;/g, '&');
				if (scope.type == jsonpStr) {
					return scope._processScriptRequest();
				} else {
					return scope._processXhrRequest(method).xhr;
				}
			},
			/**
			 * @summary							Process background JSONP request through script tag.
			 * @type		{Ajax}
			 * @access		private
			 *
			 * @return		{JsonpRequest}		JSONP driving object.
			*/
			_processScriptRequest: function () {
				/// <signature>
				///		<summary>Process background JSONP request through script tag.</summary>
				///		<returns type="JsonpRequest">JSONP driving object.</returns>
				/// </signature>
				var scope = this,
					scriptElm = d.createElement('script'),
					headElm = scope._getScriptContainerElement();
				scope.scriptElm = scriptElm;
				scope.requestId = Ajax._requestCounter++;
				scope.callbackName = Ajax._scriptCallbackTmpl + scope.requestId;
				Ajax[scope.callbackName] = function (data) {
					scope._handlerScriptRequestSuccess(data);
				};
				scope._completeUriAndGetParams(getStr, !0);
				scriptElm[setAttributeStr]('src', scope.url);
				scope._callBeforeHandlers();
				if (scope.oldIe) {
					scriptElm[attachEventStr]('on'+readyStateChangeStr, scope._handlerProviderScriptRequestError());
					scriptElm = headElm.insertAdjacentElement('beforeEnd', scriptElm);
				} else {
					scriptElm[setAttributeStr](asyncStr, asyncStr);
					scriptElm[addEventListenerStr](errorStr, scope._handlerProviderScriptRequestError(), !0);
					scriptElm = headElm.appendChild(scriptElm);
				}
				var result = {
					/**
					 * @property	{string}	url			Full appended &lt;script&gt; tag src attribute value.
					*/
					'url': scope.url,
					/**
					 * @property	{number}	id			Ajax request id.
					*/
					'id': scope.requestId,
					/**
					 * @property	{Function}	abort		Function to abort JSONP request.
					*/
					'abort': function () {
						scope._handlerScriptRequestCleanUp();
						scope._callAbortHandlers();
					}
				};
				return result;
			},
			_handlerScriptRequestSuccess: function (data) {
				var scope = this,
					called = !1;
				scope.result.success = !0;
				scope._handlerScriptRequestCleanUp();
				scope.result.data = data;
				try {
					scope.success(data, 200, null, scope.requestId, scope.url, scope.type);
					called = !0;
					scope._callSuccessHandlers();
				} catch (e) {
					if (!called) {
						setTimeout(function () {
							scope._callSuccessHandlers();
						});
					}
					throw e;
				}
			},
			_handlerProviderScriptRequestError: function () {
				var scope = this,
					scriptElm = scope.scriptElm;
				if (scope.oldIe) {
					return function (e) {
						e = e || window.event;
						if (scriptElm.readyState == 'loaded' && !scope.result.success) {
							scope._handlerScriptRequestError(e);
						}
					}
				} else {
					return function (e) {
						scope._handlerScriptRequestError(e);
					}
				}
			},
			_handlerScriptRequestError: function (e) {
				var scope = this,
					called = !1,
					errorHandler = scope._handlerProviderScriptRequestError();
				if (scope.oldIe) {
					scope.scriptElm.detachEvent('on'+readyStateChangeStr, errorHandler);
				} else {
					scope.scriptElm.removeEventListener(errorStr, errorHandler, true);
				}
				scope._handlerScriptRequestCleanUp();
				scope.errorEvent = e;
				scope._logException();
				try {
					scope.error('', 0, null, null, e, scope.requestId, scope.url, scope.type);
					called = !0;
					scope._callErrorHandlers();
				} catch (e) {
					if (!called) {
						setTimeout(function () {
							scope._callErrorHandlers();
						});
					}
					throw e;
				}
			},
			_handlerScriptRequestCleanUp: function () {
				var scope = this;
				scope.scriptElm.parentNode.removeChild(scope.scriptElm);
				if (scope.oldIe) {
					Ajax[scope.callbackName] = undefined;
				} else {
					delete Ajax[scope.callbackName];
				}
			},
			_processXhrRequest: function (method) {
				method = (method == null ? getStr : method)[toLowerCaseStr]();
				var scope = this,
					paramsStr = scope._completeUriAndGetParams(method, !1);
				scope.requestId = Ajax._requestCounter++;
				scope.xhr = scope._createXhrInstance();
				scope._processXhrRequestAddListener();
				scope.xhr.open(method, scope.url, scope.async);
				scope._setUpHeaders();
				scope._callBeforeHandlers();
				scope._processXhrRequestSend(method, paramsStr);
				return scope;
			},
			_processXhrRequestAddListener: function () {
				var scope = this,
					xhr = scope.xhr,
					handler = function (e) {
						if (xhr.readyState == 4) {
							scope._handlerXhrRequestReadyStatechange(e);
						}
					};
				if (scope.oldIe) {
					scope.xhr[attachEventStr]('on'+readyStateChangeStr, handler);
				} else {
					scope.xhr[addEventListenerStr](readyStateChangeStr, handler);
				}
			},
			_handlerXhrRequestReadyStatechange: function (e) {
				e = e || window.event;
				var scope = this,
					statusCode = scope.xhr[statusStr];
				if (statusCode > 199 && statusCode < 300){
					scope._processXhrResult();
					scope._processXhrCallbacks();
				} else if (statusCode === 0){
					scope._callAbortHandlers();
				} else {
					scope.result.success = !1;
					scope.errorEvent = e;
					scope.errorObject = new Error('Http Status Code: ' + statusCode);
					scope._processXhrCallbacks();
				}
			},
			_processXhrRequestSend: function (method, paramsStr) {
				var xhr = this.xhr;
				if (method === getStr) {
					xhr[sendStr]();
				} else if (method === postStr) {
					xhr[sendStr](paramsStr);
				}
			},
			_processXhrCallbacks: function (e) {
				var scope = this, 
					xhr = scope.xhr,
					called = !1,
					args = [];
				if (scope.result.success) {
					args = [
						scope.result.data, xhr[statusStr], xhr, 
						scope.requestId, scope.url, scope.type
					];
					try {
						scope.success.apply(null, args);
						called = !0;
						scope._callSuccessHandlers();
					} catch (e) {
						if (!called) {
							setTimeout(function () {
								scope._callSuccessHandlers();
							});
						}
						throw e;
					}
				} else {
					args = [
						xhr[responseTextStr], xhr[statusStr], xhr, 
						scope.errorEvent, scope.errorObject, 
						scope.requestId, scope.url, scope.type
					];
					scope._logException();
					try {
						scope.error.apply(null, args);
						called = !0;
						scope._callErrorHandlers();
					} catch (e) {
						if (!called) {
							setTimeout(function () {
								scope._callErrorHandlers();
							});
						}
						throw e;
					}
				}
			},
			_processXhrResult: function () {
				var scope = this;
				if (scope.type === autoStr) scope._processXhrResultDeterminateType();
				scope._processXhrResultByType();
			},
			_processXhrResultByType: function () {
				var scope = this,
					xhr = scope.xhr;
				if (scope.type === jsonStr) {
					scope._processXhrResultJson();
				} else if (scope.type === xmlStr || scope.type === htmlStr) {
					scope._processXhrResultXml();
				} else if (scope.type === textStr) {
					scope.result.data = xhr[responseTextStr];
					scope.result.success = !0;
				}
			},
			_processXhrResultDeterminateType: function () {
				var scope = this,
					ctSubject = this._getSubjectPartContentHeader();
				scope.type = textStr;
				if (ctSubject.indexOf('javascript') > -1 || ctSubject.indexOf(jsonStr) > -1) {
					// application/json,application/javascript,application/x-javascript,text/javascript,text/x-javascript,text/x-json
					scope.type = jsonStr;
				} else if (ctSubject.indexOf(htmlStr) > -1) {
					// application/xhtml+xml,text/html,application/vnd.ms-htmlhelp
					scope.type = htmlStr;
				} else if (ctSubject.indexOf(xmlStr) > -1) {
					// application/xml,text/xml,	application/xml-dtd,application/rss+xml,application/atom+xml,application/vnd.google-earth.kml+xml,model/vnd.collada+xml and much more...
					scope.type = xmlStr;
				}
			},
			_processXhrResultJson: function () {
				var scope = this,
					responseText = scope.xhr[responseTextStr];
				if (!w[jsonCapStr])
					scope._declareJson();
				try {
					scope.result.data = w[jsonCapStr][parseStr](responseText);
					scope.result.success = !0;
				} catch (e1) {
					try {
						scope.result.data = (new Function('return '+responseText))();
						scope.result.success = !0;
					} catch (e2) {}
					scope.errorObject = e1;
				}
			},
			_processXhrResultXml: function () {
				var parser = {}, 
					scope = this,
					responseText = scope.xhr[responseTextStr],
					DomParser = w.DOMParser;
				try {
					if (DomParser) {
						parser = new DomParser();
						scope.result.data = parser.parseFromString(responseText, "application/xml");
					} else {
						parser = new w.ActiveXObject('Microsoft.XMLDOM');
						parser[asyncStr] = !1;
						scope.result.data = parser.loadXML(responseText);
					}
					scope.result.success = !0;
				} catch (e) {
					scope.errorObject = e;
				}
			},
			_getSubjectPartContentHeader: function () {
				var contentType = this._getCompleteContentTypeHeader(),
					slashPos = contentType.indexOf('/');
				if (slashPos > -1) contentType = contentType.substr(slashPos + 1);
				return contentType;
			},
			_getCompleteContentTypeHeader: function () {
				var scope = this,
					contentType = scope.xhr.getResponseHeader("Content-Type"),
					semicolPos = contentType.indexOf(';');
				contentType = contentType.length > 0 ? contentType[toLowerCaseStr]() : '';
				if (semicolPos > -1) contentType = contentType.substr(0, semicolPos);
				return contentType;
			},
			_createXhrInstance: function () {
				var xhrInstance,
					activeXObjTypes = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
				if (w.XMLHttpRequest) {
					xhrInstance = new w.XMLHttpRequest();
				} else {
					for (var i = 0, l = activeXObjTypes.length; i < l; i += 1) {
						try{
							xhrInstance = new w.ActiveXObject(activeXObjTypes[i]);
						} catch (e) {};
					};
				}
				return xhrInstance;
			},
			_setUpHeaders: function () {
				var scope = this,
					xhr = scope.xhr,
					setReqHeader = 'setRequestHeader',
					configuredHeaders = scope.headers,
					defaultHeaders = Ajax[defaultHeadersStr];
				for (var headerName in configuredHeaders) {
					xhr[setReqHeader](headerName, configuredHeaders[headerName]);
				}
				for (headerName in defaultHeaders) {
					if (configuredHeaders[headerName]) continue;
					xhr[setReqHeader](headerName, defaultHeaders[headerName]);
				}
			},
			_completeUriAndGetParams: function (method, jsonp) {
				var scope = this,
					dataStr = '',
					qsMark = '?',
					amp = '&',
					eq = '=',
					delimiter = qsMark,
					url = scope.url,
					delimPos = url.indexOf(delimiter);
				if (delimPos > -1) {
					delimiter = (delimPos === url.length - 1)
						? ''
						: amp;
				}
				method = method[toLowerCaseStr]();
				if (method === getStr) {
					dataStr = scope._completeDataString(!0);
					url += delimiter + dataStr;
					delimiter = amp;
					dataStr = '';
				} else {
					dataStr = scope._completeDataString(!1);
				}
				if (!scope.cache)
					url += delimiter + Ajax[cacheBusterParamNameStr] + eq + (+new Date);
				if (jsonp)
					url += delimiter + Ajax[jsonpCallbackParamStr] + eq + scope._getLibraryName() + '.' + scope.callbackName;
				scope.url = url;
				return dataStr;
			},
			_completeDataString: function (isGet) {
				var scope = this,
					data = scope.data,
					jsonDecl = !!w[jsonCapStr];
				if (typeof(data) == 'string') {
					if (!isGet) {
						return data;
					} else {
						if (!jsonDecl)
							jsonDecl = scope._declareJson();
						scope.data = w[jsonCapStr][parseStr](data);
					}
				}
				if (!jsonDecl)
					scope._declareJson();
				return this._stringifyDataObject(isGet);
			},
			_stringifyDataObject: function (isGet) {
				var scope = this,
					item = null,
					itemType = null,
					data = scope.data,
					dataArr = [], 
					dataStr = '',
					json = w[jsonCapStr],
					strf = 'stringify',
					encoder = w.encodeURIComponent;
				for (var key in data) {
					item = data[key];
					if (item == null) {
						dataArr.push(key + '=');
					} else {
						itemType = this._typeOf(item);
						if (itemType == 'Object') {
							dataStr = encoder(json[strf](item));
							dataArr.push(key + '=' + dataStr);
						} else if (itemType == 'Array') {
							for (var i = 0, l = item.length; i < l; i++) {
								dataStr = encoder(json[strf](item[i]));	
								dataArr.push(key + '[]=' + dataStr);
							}
						} else {
							dataStr = encoder(String(item));
							dataArr.push(key + '=' + dataStr);
						}
					}
				}
				return dataArr.join('&');
			},
			_typeOf: function (o) {
				var typeStr = Object[prototypeStr].toString.apply(o);
				return typeStr.substring(8, typeStr.length - 1);
			},
			_declareJson: function () {
				// include json2
				window.JSON=function(){function f(n){return n<10?'0'+n:n;}
				Date.prototype.toJSON=function(){return this.getUTCFullYear()+'-'+
				f(this.getUTCMonth()+1)+'-'+
				f(this.getUTCDate())+'T'+
				f(this.getUTCHours())+':'+
				f(this.getUTCMinutes())+':'+
				f(this.getUTCSeconds())+'Z';};var m={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'};function stringify(value,whitelist){var a,i,k,l,r=/["\\\x00-\x1f\x7f-\x9f]/g,v;switch(typeof value){case'string':return r.test(value)?'"'+value.replace(r,function(a){var c=m[a];if(c){return c;}
				c=a.charCodeAt();return'\\u00'+Math.floor(c/16).toString(16)+
				(c%16).toString(16);})+'"':'"'+value+'"';case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
				if(typeof value.toJSON==='function'){return stringify(value.toJSON());}
				a=[];if(typeof value.length==='number'&&!(value.propertyIsEnumerable('length'))){l=value.length;for(i=0;i<l;i+=1){a.push(stringify(value[i],whitelist)||'null');}
				return'['+a.join(',')+']';}
				if(whitelist){l=whitelist.length;for(i=0;i<l;i+=1){k=whitelist[i];if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}else{for(k in value){if(typeof k==='string'){v=stringify(value[k],whitelist);if(v){a.push(stringify(k)+':'+v);}}}}
				return'{'+a.join(',')+'}';}}
				return{'stringify':stringify,'parse':function(text,filter){var j;function walk(k,v){var i,n;if(v&&typeof v==='object'){for(i in v){if(Object.prototype.hasOwnProperty.apply(v,[i])){n=walk(i,v[i]);if(n!==undefined){v[i]=n;}}}}
				return filter(k,v);}
				if(/^[\],:{}\s]*$/.test(text.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof filter==='function'?walk('',j):j;}
				throw new SyntaxError('parseJSON');}};}();
				return !0;
			},
			_getScriptContainerElement: function () {
				var headElm = d.body,
					prevSibl = 'previousSibling';
				while (true) {
					if (headElm[prevSibl] == null) break;
					headElm = headElm[prevSibl];
					if (headElm.nodeName[toLowerCaseStr]() === 'head') break;
				}
				return headElm;
			},
			_callBeforeHandlers: function () {
				var scope = this;
				this._callHandlers(
					beforeStr, 
					scope.type === jsonpStr
						? [null] 
						: [scope.xhr]
				);
			},
			_callSuccessHandlers: function () {
				var scope = this,
					xhr = scope.xhr,
					data = scope.result.data;
				this._callHandlers(
					successStr, 
					scope.type === jsonpStr
						? [data, 200, null] 
						: [data, xhr[statusStr], xhr]
				);
			},
			_callAbortHandlers: function () {
				var scope = this;
				this._callHandlers(
					abortStr, 
					scope.type === jsonpStr
						? [null] 
						: [scope.xhr]
				);
			},
			_callErrorHandlers: function () {
				var scope = this, xhr = scope.xhr;
				this._callHandlers(
					errorStr, 
					scope.type === jsonpStr
						? ['', 0, null, null, scope.errorEvent] 
						: [xhr[responseTextStr], xhr[statusStr], xhr, scope.errorObj, null]
				);
			},
			_callHandlers: function (handlersKey, args) {
				var handlers = Ajax[handlersStr][handlersKey],
					scope = this,
					handler = function () {},
					additionalArgs = [];
				args.push(scope.requestId, scope.url, scope.type);
				for (var i = 0, l = handlers.length; i < l; i += 1) {
					handler = handlers[i];
					if (typeof(handler) != 'function') continue;
					handler.apply(null, args);
				}
			},
			_logException: function () {
				var consoleStr = 'console',
					logStr = 'log',
					scope = this,
					id = scope.requestId,
					url = scope.url,
					type = scope.type,
					jsonp = type === jsonpStr,
					errorObj = scope.errorObject,
					errorEvent = scope.errorEvent,
					xhr = scope.xhr;
				if (!w[consoleStr]) return;
				if (jsonp) {
					w[consoleStr][logStr](id, url, type, 0, errorEvent);
				} else {
					w[consoleStr][logStr](id, url, type, xhr, xhr[statusStr], xhr[responseTextStr], errorObj, errorObj.stack);
				}
			},
			_getLibraryName: function () {
				var constructorStr = this.toString();
				return constructorStr.substr(8, constructorStr.length - 9);
			}
		};
		return Ajax;
	})(
		globalVar, document,
		'readystatechange', 'success', 'error',
		'responseText', 'handlers', 'jsonp',
		'status', 'jsonpCallbackParam', 'cacheBusterParamName',
		'JSON', 'before', 'abort',
		'json', 'xml', 'html',
		'text', 'addEventListener', 'attachEvent',
		'async', 'setAttribute', 'toLowerCase',
		'auto', 'post', 'get',
		'send', 'parse', 'defaultHeaders',
		'prototype'
	);
	if (modules && typeof module != undefinedStr) {
		module.exports = Ajax;
	}
})('undefined', !1);