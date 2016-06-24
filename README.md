# Javascript AJAX (ajax.js)
Very effective, supersmall, cross browser AJAX library, supporting JSON, JSONP, XML, HTML or TEXT requesting or returning result type by HTTP header Content-Type, automatic data serialization, automatic evaluation by recognized type, global handlers and syntax based on jQuery.ajax();.

## Features
- very effective, super small javascript AJAX library - **minimized: 6.1 KB**, **gzipped: 2.6 KB**
- **syntax based on jQuery.ajax();**, no promisses
- supported browsers: **MSIE6+, Firefox, Chrome, Safari, Opera and mobile browsers**
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
  - Ajax.onBeforeLoad(function(){xhr});
  - Ajax.onLoadSuccess(function(){data, statusCode, xhr});
  - Ajax.onLoadError(function(responseText, statusCode, xhr){});

## Usage
Include JAVASCRIPT file **ajax.min.js** into your HTML page in \<head\> section, no other library is necessary:
```
<script src="/path/to/ajax.min.js" type="text/javascript"></script>
```

### Universal syntax
```
Ajax.load({
	// required - relative or absolute path
	url: 'json.php',
	// not required, get by default
	method: 'post',
	// not required, any structured data are automaticly stringified by JSON.stringify() included in this library
	data: {
  		key1: "value1",
  		key2: [
  			"anything",
			{"with": ["JSON", "structure"]}
  		]  
	},
	// not required, possible values: JSON,JSONP,XML,HTML,TEXT, 
	// if not set, data are parsed/evaluated by HTTP header
	type: 'json',
	// not required, custom code in success, data are automaticly evaluated or parsed by type param or HTTP header
	success: function (data, statusCode, xhr) {},
	// not required, custom code in error
	error: function (responseText, statusCode, xhr) {}
	// not required, true by default
	async: true,
	// not required, http headers to overwrite before data are sended, empty object by default
	headers: {
		// 'content-Type': 'allication/xml'
	}
});
```
