# Javascript AJAX (ajax.js)

* [ajax.min.js download](https://raw.githubusercontent.com/tomFlidr/ajax.js/master/src/ajax.min.js)

Very effective, supersmall, cross browser AJAX library, supporting JSON, JSONP, XML, HTML or TEXT requesting or returning result type by HTTP header Content-Type, automatic data serialization, automatic evaluation by recognized type, global handlers and syntax based on jQuery.ajax();.

## Features
- very effective, super small javascript AJAX library - **minimized: 7.8 KB**, **gzipped: 3.1 KB**
- **syntax based on jQuery.ajax();**, Ajax.load();, Ajax.get();, Ajax.post();, no promisses, returning XmlHttpRequest
- supported browsers: **MSIE6+, Firefox, Chrome, Safari, Opera and mobile browsers**
- **highly optimized**
- supported request methods: 
  - **GET, POST** - **by XMLHttpRequest**, still possible to request diferent domains with **"Access-Control-Allow-Origin"**
  - **GET** through type: **JSONP** - **by \<stript\> tag**, to request foreing domains without any other settings
- **automatic JSON serialization** into format: key1=value1&key2=["anything",{"with":["JSON","structure"]}]  
- data always **sended with HTTP header Content-Type: application/x-www-form-urlencoded** and posibility to change
- **JSON evaluation and XML/HTML parsing** into environment types by type param
- **automatic result conversion by HTTP header 'Content-Type'** into JSON/XML/HTML/TEXT if no type param defined
- posibility to **change any http header before** send **and read any header after** data are loaded or error handled
- posibility to change async requesting to sync (but it is not recomanded, by default is async)
- **global handlers for each request** to set up error loging or loading animations:
  - Ajax.beforeLoad(function(requestId, url, type, xhr){});
  - Ajax.onSuccess(function(requestId, url, type, xhr, statusCode, data){});
  - Ajax.onAbort(function(requestId, url, type, xhr){});
  - Ajax.onError(function(requestId, url, type, xhr, statusCode, responseText, errorEvent){});

## Usage
Include JAVASCRIPT file **ajax.min.js** into your HTML page in \<head\> section, no other library is necessary:
```
<script src="https://tomflidr.github.io/ajax.js/src/ajax.min.js"></script>
```

### Universal syntax
#### Basic syntax
Standard browser window.XMLHttpRequest object is returned, for JSONP requests is returned object described later.
```
// into xhr is returned XMLHttpRequest instance, in MSIE 8- ActiveObject instance is returned
var xhr = Ajax.load({
     url: '',                // string, required
     method: '',             // string, default: 'get', not required
     data: {},               // object (to be serialized), default: {}, not required
     success: function(){},  // function, default: function(){data, statusCode, xhr}, not required
     type: '',               // string, default: '' (result is be processed by Content-Type HTTP header), not req.
     error: function(){},    // function, default: function(responseText, statusCode, xhr){}, not required
     headers: {},            // object, default: {}, not required
     async: true             // boolean, default: true, not required
});
```
#### Full example
Create any *.html file in base project directory and paste this code into \<script\> tag:
```
var xhr = Ajax.load({
	// required - relative or absolute path
	url: 'data/books.json',
	// not required, get by default
	method: 'post',
	// not required, any structured data are automaticly stringified 
	// by JSON.stringify() included in this library
	data: {
  		key1: "value1",
  		key2: [
  			"anything",
			{"with": ["JSON", "structure"]}
  		]  
	},
	// not required, custom callback for success, data are automaticly 
	// evaluated or parsed by type param or HTTP header
	success: function (data, statusCode, xhr) {
		console.log(arguments);
	},
	// not required, possible values: JSON, JSONP, XML, HTML, TEXT, 
	// if not set, data are parsed/evaluated by HTTP header
	type: 'json',
	// not required, custom callback for error
	error: function (responseText, statusCode, xhr) {
		console.log(arguments);
	},
	// not required, true by default
	async: true,
	// not required, http headers to overwrite before data are sended, empty object by default
	headers: {
		// 'Content-Type': 'multipart/form-data'
	}
});
```

### GET request
#### Basic syntax
Standard browser window.XMLHttpRequest object is returned, for JSONP requests is returned object described later.
```
// into xhr is returned XMLHttpRequest instance, in MSIE 8- ActiveObject instance is returned
var xhr = Ajax.get(
	url,		// string, required
	data, 		// object (to be serialized), default: {}, not required
	success, 	// function, default: function(data, statusCode, xhr){}, not required
	type, 		// string, default: '' (result is be evaluated/parsed by Content-Type HTTP header), not required
	error, 		// function, default: function(responseText, statusCode, xhr){}, not required
	headers,	// object, default: {}, not required
	async 		// boolean, default: true, not required
);
```
#### Full example
Create any *.html file in base project directory and paste this code into \<script\> tag:
```
var xhr = Ajax.get(
	// required - relative or absolute path
	'data/books.json',
	// not required, any structured data are automaticly stringified 
	// by JSON.stringify() included in this library
	data: {
  		key1: "value1",
  		key2: [
  			"anything",
			{"with": ["JSON", "structure"]}
  		]  
	},
	// not required, custom callback for success, data are automaticly 
	// evaluated or parsed by type param or HTTP header
	function (data, statusCode, xhr) {
		console.log(arguments);
	},
	// not required, possible values: JSON, JSONP, XML, HTML, TEXT, 
	// if not set, data are parsed/evaluated by HTTP header
	'json',
	// not required, custom callback for error
	function (responseText, statusCode, xhr) {
		console.log(arguments);
	}
);
```

### POST request
#### Basic syntax
Standard browser window.XMLHttpRequest object is returned, for JSONP requests is returned object described later.
```
// into xhr is returned XMLHttpRequest instance, in MSIE 8- ActiveObject instance is returned
var xhr = Ajax.post(
	url,		// string, required
	data, 		// object (to be serialized), default: {}, not required
	success, 	// function, default: function(data, statusCode, xhr){}, not required
	type, 		// string, default: '' (result is be evaluated/parsed by Content-Type HTTP header), not required
	error, 		// function, default: function(responseText, statusCode, xhr){}, not required
	headers,	// object, default: {}, not required
	async 		// boolean, default: true, not required
);
```
#### Full example
Create any *.html file in base project directory and paste this code into \<script\> tag:
```
var xhr = Ajax.post(
	// required - relative or absolute path
	'data/books.xml',
	// not required, any structured data are automaticly stringified 
	// by JSON.stringify() included in this library
	data: {
  		key1: "value1",
  		key2: [
  			"anything",
			{"with": ["JSON", "structure"]}
  		]  
	},
	// not required, custom callback for success, data are automaticly 
	// evaluated or parsed by type param or HTTP header
	function (data, statusCode, xhr) {
		console.log(arguments);
	},
	// not required, possible values: JSON, JSONP, XML, HTML, TEXT, 
	// if not set, data are parsed/evaluated by HTTP header
	'xml',
	// not required, custom callback for error
	function (responseText, statusCode, xhr) {
		console.log(arguments);
	}
);
```

### GET JSONP request
#### Description

For all requests with return type initialized with JSONP value is not created standard instance from browser's window.XMLHttpRequest, but there is created temporary \<script\> tag in \<head\> section of your HTML file to safely include script resource from foreing domain without any broser security Error thrown. You can load data from foreing domains also by using HTTP header "Access-Control-Allow-Origin", but it's not what is necessary to describe here. 
To be clear - **there is possible with JSONP to use only GET method** - to send and load data from foreing domain. So be careful, there are some [**limitations for url length**](https://support.microsoft.com/cs-cz/kb/208427), because all params are contained in url. 

Before \<script\> tag is appended into \<head\> section, there is initialized **temporary public function** in **window.Ajax.JsonpCallback[X]** to handle incoming script content. Name of this public function is sended to foreing server in GET param named as "&callback=Ajax.JsonpCallback[X]". Ajax library presume, that server always return only content with only this public function call with first argument containing result data. Be careful for server trust, there should be anything else, but it doesn't happend (but it's only a different way how to say - it happends:-). After script is loaded by browser, initialized in \<head\> section, then prepared public function is called. Temporary \<script\> tag is removed, public function is also deleted and your custom callback is called.

##### Return type
Ajax.load() and Ajax.get() will not return any xhr object if you use JSONP data type to return. There is returned javascript object with three properties:
```
var jsonpReq = {
	url	// string, complete script tag str url
	script	// HTMLScriptElement, stript tag object appended into \<head\> section
	abort	// function, local library function to abort request
};
```
If you want to manipulate with this kind of request resources, be free to do anything. Read more in source lines in function "_processScriptRequest". But to abort JSONP request - it's just only necessrry to:
```
var jsonpReq.abort();
```

#### Full example
```
var jsonpReq = Ajax.get(
	'data/books.json',
	data: {
  		key1: "value1",
  		key2: [
  			"anything",
			{"with": ["JSON", "structure"]}
  		]  
	},
	function (data, statusCode, xhr) {
		console.log(arguments);
	},
	'jsonp'
);
// to abort request any time - use:
jsonpReq.abort();
// jsonpReqCtrl.abort(); removes \<script\>tag from \< head\>section, unset global handler 
```

### Global handlers
#### Add global handler
There is called queue of handlers before each request by window.XMLHttpHeader object and also before each request by JSONP requesting throught \<script\> tags. Also there is called a queue of handlers after each success response for these request types. To add any handler function to these queues is necessary to call static Ajax object functions:
```
// not required - add function into queue called before each request type
Ajax.beforeLoad(function (requestId, url, type, xhr) {
	document.body.style.cursor = 'wait !important';
});
// not required - add function into queue called after request is aborted by programmer
Ajax.onAbort(function (requestId, url, type, xhr) {
	document.body.style.cursor = 'default';
});
// not required - add function into queue called after each success request type
Ajax.onSuccess(function (requestId, url, type, xhr, statusCode, data) {
	document.body.style.cursor = 'default';
});
// not required - add function into queue called after each error request type
Ajax.onError(function (requestId, url, type, xhr, statusCode, responseText, errorEvent) {
	console.log(arguments);
});
```
All global handlers return Ajax library declaration function, so it's possible to init global handlers like:
```
Ajax.beforeLoad(function (requestId, url, type, xhr) {
	document.body.style.cursor = 'wait !important';
}).onAbort(function (requestId, url, type, xhr) {
	document.body.style.cursor = 'wait !important';
}).onSuccess(function (requestId, url, type, xhr, statusCode, data) {
	document.body.style.cursor = 'default';
}).onError(function (requestId, url, type, xhr, statusCode, responseText, errorEvent) {
	console.log(arguments);
});
```
#### Remove global handler
Handlers are stored in arrays placed in:
```
Ajax.handlers.before = [];
Ajax.handlers.abort = [];
Ajax.handlers.success = [];
Ajax.handlers.error = [];
```
Feel free to use them as standard arrays with functions to add or remove any handler anytime. There are no any static functions on Ajax object to remove handlers, so it's necessary to do it (if you want) by:
```
delete Ajax.handlers.before[yourDesireIndex];
```

### Public static properties
#### Ajax.defaultHeaders
HTTP default headers sended in each request by XMLHttpRequest, not in JSONP requesting.
Feel free to change it.
```
Ajax.defaultHeaders = {
	'X-Requested-With': 'XmlHttpRequest',
	'Content-Type': 'application/x-www-form-urlencoded'
};
```
#### Ajax.jsonpCallbackParam
JSONP requesting GET param name how to say name of public callback function to server.
Specific name of the function is generated by library. As default library uses name 'callback'.
Most of JSON APIs uses standard naming convention - 'callback' value, but sometimes should be handy to change it.
```
Ajax.jsonpCallbackParam = 'callback';
```
