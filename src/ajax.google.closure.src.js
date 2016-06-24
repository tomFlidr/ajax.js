/**
 * Javascript Ajax
 * @author: Tom Flidr | tomflidr(at)gmail(dot)com
 * @url: https://github.com/tomFlidr/ajax.js
 * @version: 1.0
 * @date: 2015-10-11
 * @usage: basic example:
Ajax.load({
	url: 'https://github.com/tomFlidr',
	method: 'post',
	data: {
		anything: ["to", "serialize"]
	},
	success: function (data, statusCode, xhr) {
	},
	error: function (responseText, statusCode, xhr) {
	}
});
*/
Ajax = function () {};
Ajax['handlers'] = {
	'before': [],
	'success': [],
	'error': []
};
Ajax['defaultHeaders'] = {
	'X-Requested-With': 'XmlHttpRequest',
	'Content-Type': 'application/x-www-form-urlencoded'
};
Ajax._scriptCallbackTmpl = 'AjaxJsonpCallback_';
Ajax._scriptCallbackCounter = 0;
Ajax['onBeforeLoad'] = function (fn) {
	Ajax['handlers']['before'].push(fn);
};
Ajax['onLoadSuccess'] = function (fn) {
	Ajax['handlers']['success'].push(fn);
};
Ajax['onLoadError'] = function (fn) {
	Ajax['handlers']['error'].push(fn);
};
Ajax['get'] = function () {
	var ajax = new Ajax();
	return ajax._init.apply(ajax, [].slice.apply(arguments))._processRequest();
};
Ajax['post'] = function () {
	var ajax = new Ajax();
	return ajax._init.apply(ajax, [].slice.apply(arguments))._processRequest('post');
};
Ajax['load'] = function (cfg) {
	var ajax = new Ajax();
	cfg['async'] = typeof(cfg['async']) == 'undefined' ? !0 : cfg['async'];
	return ajax._init(
		cfg['url'], 
		cfg['data'], 
		cfg['type'], 
		cfg['success'], 
		cfg['error'], 
		cfg['async']
	)._processRequest(cfg['method']);
};
Ajax['prototype'] = {
	_init: function (url, data, type, success, error, async, headers) {
		var fn = function () {}, scope = this;
		scope.url = url || '';
		scope.data = data || {};
		scope.type = (type === undefined ? '' : type).toLowerCase() || '';
		scope.success = success || fn;
		scope.error = error || fn;
		scope.async = typeof(async) == 'undefined' ? !0 : async;
		scope.headers = headers || {};
		scope.result = {
			success: !0, 
			data: {}
		};
		return scope;
	},
	_processRequest: function (method) 
	{
		var scope = this;
		if (scope.type == 'jsonp') {
			return scope._processScriptRequest()
		} else {
			return scope._processXhrRequest(method);
		}
	},
	_processScriptRequest: function ()
	{
		var scope = this,
			doc = document,
			win = window,
			oldIe = !!doc.all,
			scriptElm = doc['createElement']('script'),
			headElm = scope._getScriptContainerElement(),
			callbackName = Ajax._scriptCallbackTmpl + Ajax._scriptCallbackCounter++;
		win[callbackName] = function (data) {
			scriptElm['parentNode']['removeChild'](scriptElm);
			if (oldIe) {
				win[callbackName] = undefined;
			} else {
				delete win[callbackName];
			}
			scope._callSuccessHandlers();
			scope.result.data = data;
			scope.success(data);
		};
		scope.data['callback'] = callbackName;
		scope._completeUriAndGetParams('get');
		scriptElm['setAttribute']('src', scope.url);
		scope._callBeforeHandlers();
		if (oldIe) {
			scriptElm = headElm['insertAdjacentElement']('beforeEnd', scriptElm);
		} else {
			scriptElm = headElm['appendChild'](scriptElm);
		}
		return scope;
	},
	_processXhrRequest: function (method)
	{
		var method = (method === undefined ? 'get' : method).toLowerCase(),
			scope = this,
			paramsStr = scope._completeUriAndGetParams(method);
		scope.xhr = scope._createXhrInstance();
		scope.xhr['open'](method, scope.url, scope.async);
		scope._setUpHeaders();
		scope._callBeforeHandlers();
		scope.xhr['onreadystatechange'] = function (e) {
			if (scope.xhr['readyState'] == 4) {
				scope._processResponse(e);
			}
		};
		if (method == 'get') {
			scope.xhr['send']();
		} else if (method == 'post') {
			scope.xhr['send'](paramsStr);
		}
		return scope;
	},
	_processResponse: function (e)
	{
		var scope = this, xhr = scope.xhr;
		if (xhr['status'] == 200){
			scope._processResult();
		} else {
			scope._responseException(new Error('Http Status Code: ' + xhr['status']));
		}
		if (!scope.result['success']) {
			scope._callErrorHandlers();
			scope.error(
				xhr['responseText'], 
				xhr['status'], 
				xhr
			);
		}
	},
	_processResult: function ()
	{
		var scope = this,
			xhr = scope.xhr;
		if (scope.type.length === 0) scope._determinateTypeByContentTypeHeader();
		// if parsing cause any error - call error handlers immediately
		scope._processResultByType();
		// rest is only for successfully finished parsing:
		if (scope.result['success']) {
			scope._callSuccessHandlers();
			scope.success(
				scope.result.data, 
				xhr['status'], 
				xhr
			);
		}
	},
	_processResultByType: function () {
		var scope = this,
			xhr = scope.xhr;
		if (scope.type == 'json') {
			scope._createResultJson();
		} else if (scope.type == 'xml') {
			scope._createResultXml();
		} else if (scope.type == 'text') {
			scope.result.data = xhr['responseText'];
		}
	},
	_determinateTypeByContentTypeHeader: function () {
		var scope = this,
			ctSubject = this._getSubjectPartContentHeader();
		scope.type = 'text';
		if (ctSubject.indexOf('javascript') > -1 || ctSubject.indexOf('json') > -1) {
			// application/json,application/javascript,application/x-javascript,text/javascript,text/x-javascript,text/x-json
			scope.type = 'json';
		} else if (ctSubject.indexOf('html') > -1) {
			// application/xhtml+xml,text/html,application/vnd.ms-htmlhelp
			scope.type = 'html';
		} else if (ctSubject.indexOf('xml') > -1) {
			// application/xml,text/xml,	application/xml-dtd,application/rss+xml,application/atom+xml,application/vnd.google-earth.kml+xml,model/vnd.collada+xml and much more...
			scope.type = 'xml';
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
			contentType = scope.xhr['getResponseHeader']("Content-Type"),
			semicolPos = contentType.indexOf(';');
		contentType = contentType.length > 0 ? contentType.toLowerCase() : '';
		if (semicolPos > -1) contentType = contentType.substr(0, semicolPos);
		return contentType;
	},
	_createResultJson: function ()
	{
		var win = window, scope = this;
		try {
			scope.result.data = (new Function('return '+scope.xhr['responseText']))();
		} catch (e) {
			scope._responseException(e);
		}
	},
	_createResultXml: function ()
	{
		var parser = {}, 
			win = window, 
			scope = this,
			responseText = scope.xhr['responseText'],
			DomParser = win['DOMParser'];
		try {
			if (DomParser) {
				parser = new DomParser();
				scope.result.data = parser['parseFromString'](responseText, "application/xml");
			} else {
				parser = new win['ActiveXObject']('Microsoft.XMLDOM');
				parser['async'] = !1;
				scope.result.data = parser['loadXML'](responseText);
			}
		} catch (e) {
			scope._responseException(e);
		}
	},
	_createXhrInstance: function ()
	{
		var xhrInstance,
			win = window,
			activeXObjTypes = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Msxml2.XMLHTTP', 'Microsoft.XMLHTTP'];
		if (win['XMLHttpRequest']) {
			xhrInstance = new win['XMLHttpRequest']();
		} else {
			for (var i = 0, l = activeXObjTypes.length; i < l; i += 1) {
				try{
					xhrInstance = new win['ActiveXObject'](activeXObjTypes[i]);
				} catch (e) {};
			};
		}
		return xhrInstance;
	},
	_setUpHeaders: function ()
	{
		var scope = this,
			xhr = scope.xhr,
			configuredHeaders = scope.headers,
			defaultHeaders = Ajax['defaultHeaders'];
		for (var headerName in configuredHeaders) {
			xhr['setRequestHeader'](headerName, configuredHeaders[headerName]);
		}
		for (headerName in defaultHeaders) {
			if (configuredHeaders[headerName]) continue;
			xhr['setRequestHeader'](headerName, defaultHeaders[headerName]);
		}
	},
	_completeUriAndGetParams: function (method)
	{
		var scope = this,
			paramsStr = '',
			delimiter = '?',
			url = scope.url,
			delimPos = url.indexOf(delimiter),
			method = method.toLowerCase();
		if (method == 'get') {
			scope.data['_'] = +new Date; // cache buster
			paramsStr = scope._stringifyParams();
			if (delimPos > -1) {
				delimiter = (delimPos == url.length - 1) ? '' : '&';
			}
			scope.url = url + delimiter + paramsStr;
		} else {
			paramsStr = scope._stringifyParams();
		}
		return paramsStr;
	},
	_stringifyParams: function ()
	{
		var scope = this,
			data = scope.data,
			dataArr = [], 
			dataStr = '',
			w = window;
		for (var key in data) {
			if (typeof(data[key]) == 'object') {
				if(!w['JSON']) scope._declareJson();
				dataStr = w['JSON']['stringify'](data[key])
			} else {
				dataStr = data[key].toString();
			}
			dataArr.push(key+'='+dataStr);
		}
		return dataArr.join('&');
	},
	_declareJson: function ()
	{
		// include json2
		window['JSON']=function(){function f(n){return n<10?'0'+n:n;}
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
		return{stringify:stringify,parse:function(text,filter){var j;function walk(k,v){var i,n;if(v&&typeof v==='object'){for(i in v){if(Object.prototype.hasOwnProperty.apply(v,[i])){n=walk(i,v[i]);if(n!==undefined){v[i]=n;}}}}
		return filter(k,v);}
		if(/^[\],:{}\s]*$/.test(text.replace(/\\./g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof filter==='function'?walk('',j):j;}
		throw new SyntaxError('parseJSON');}};}();
	},
	_getScriptContainerElement: function ()
	{
		var headElm = document['body'];
		while (true) {
			if (headElm['previousSibling'] === null || headElm['previousSibling'] === undefined) break;
			headElm = headElm['previousSibling'];
			if (headElm['nodeName']['toLowerCase']() == 'head') break;
		}
		return headElm;
	},
	_callBeforeHandlers: function () {
		var handlers = Ajax['handlers']['before'],
			scope = this,
			jsonp = scope.type == 'jsonp';
		for (var key in handlers) {
			handlers[key](jsonp ? null : scope.xhr);
		}
	},
	_callSuccessHandlers: function () {
		var handlers = Ajax['handlers']['success'],
			scope = this,
			jsonp = scope.type == 'jsonp';
		for (var key in handlers) {
			if (jsonp) {
				handlers[key](scope.result.data, 200, null);
			} else {
				handlers[key](scope.result.data, scope.xhr['status'], scope.xhr);
			}
		}
	},
	_callErrorHandlers: function () {
		var handlers = Ajax['handlers']['error'],
			xhr = this.xhr;	
		for (var key in handlers) handlers[key](xhr['responseText'], xhr['status'], xhr);
	},
	_responseException: function (e) {
		var win = window;
		this.result['success'] = false;
		if (win['console']) win['console']['log'](e['stack'], this.xhr);
	}
};