# Javascript AJAX (ajax.js)

* [ajax.min.js download](https://raw.githubusercontent.com/tomFlidr/ajax.js/master/src/ajax.min.js)

Very effective, supersmall, cross browser AJAX library, supporting JSON, JSONP, XML, HTML or TEXT requesting or returning result type by HTTP header Content-Type, automatic data serialization, automatic evaluation by recognized type, global handlers and syntax based on jQuery.ajax();.

## Features
- very effective, super small javascript AJAX library - **minimized: 6.1 KB**, **gzipped: 2.6 KB**
- **syntax based on jQuery.ajax();**, no promisses
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
  - Ajax.onBeforeLoad(function(xhr){});
  - Ajax.onLoadSuccess(function(data, statusCode, xhr){});
  - Ajax.onLoadError(function(responseText, statusCode, xhr){});

## Usage
Include JAVASCRIPT file **ajax.min.js** into your HTML page in \<head\> section, no other library is necessary:
```
<script src="src/ajax.min.js"></script>
```

### Universal syntax
#### Basic syntax
Standard browser window.XMLHttpRequest object is returned, for JSONP requests is returned object described later.
```
var xhr = Ajax.load({
	url: '',		// string, required
	data: {}, 		// object (to be serialized), default: {}, not required
	success: function(){},	// function, default: function(){data, statusCode, xhr}, not required
	type: '', 		// string, default: '' (result is be evaluated/parsed by Content-Type HTTP header), not required
	error: function(){}, 	// function, default: function(responseText, statusCode, xhr){}, not required
	headers: {},		// object, default: {}, not required
	async: true 		// boolean, default: true, not required
});
```
#### Full example
Create any *.html file in base project directory and paste this code into \<script\> tag:
```
Ajax.load({
	// required - relative or absolute path
	url: 'demos/data/books.json',
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
Ajax.get(
	// required - relative or absolute path
	'demos/data/books.json',
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
Ajax.post(
	// required - relative or absolute path
	'demos/data/books.xml',
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

### Global handlers
#### Add global handler
There is called queue of handlers before each request by window.XMLHttpHeader object and also before each request by JSONP requesting throught \<script\> tags. Also there is called a queue of handlers after each success response for these request types. To add any handler function to these queues is necessary to call static Ajax object functions:
```
// not required - add function into queue called before each request type
Ajax.onBeforeLoad(function (xhr) {
	document.body.style.cursor = 'wait !important';
});
// not required - add function into queue called after each success request type
Ajax.onLoadSuccess(function (data, statusCode, xhr) {
	document.body.style.cursor = 'default';
});
// not required - add function into queue called after each error request type
Ajax.onLoadError(function (responseText, statusCode, xhr) {
	console.log(arguments);
});
```
All global handlers return Ajax library declaration function, so it's possible to init global handlers like:
```
Ajax.onBeforeLoad(function (xhr) {
	document.body.style.cursor = 'wait !important';
}).onLoadSuccess(function (data, statusCode, xhr) {
	document.body.style.cursor = 'default';
}).onLoadError(function (responseText, statusCode, xhr) {
	console.log(arguments);
});
```
#### Remove global handler
Handlers are stored in arrays placed in:
```
Ajax.handlers.before = [];
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
