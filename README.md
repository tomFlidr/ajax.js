# Javascript AJAX (ajax.js)
Very effective, supersmall, cross browser AJAX library, supporting JSON, JSONP, XML, HTML or TEXT requesting or returning result type by HTTP header Content-Type, automatic data serialization, automatic evaluation by recognized type, global handlers and syntax based on jQuery.ajax();.

## Features
- very effective, super small javascript AJAX library - minimized: 6.1 KB, gzipped: 2.6 KB
- syntax base on jQuery.ajax();, no promisses
- supported browsers: MSIE6+, Firefox, Chrome, Safari, Opera and mobile browsers
- supported request methods: GET, POST (by XMLHttpRequest) and GET through type: JSONP (by <stript> tag) to request foreing domains
- automatic JSON serialization into format: key1=value1&key2=["anything",{"with":["JSON","structure"]}]  
- data always sended with HTTP header Content-Type: application/x-www-form-urlencoded and posibility to change
- JSON evaluation and XML/HTML parsing into environment types by type param
- automatic result conversion by HTTP header 'Content-Type' into JSON/XML/HTML/TEXT if no type param defined
- global handlers for each request to set up error loging or loading animations:
  - Ajax.onBeforeLoad(function(){xhr});
  - Ajax.onLoadSuccess(function(){data, statusCode, xhr});
  - Ajax.onLoadError(function(responseText, statusCode, xhr){});

- possible params:
  - changing sended headers
  - switching async to off (default on)
  - 

```




```
