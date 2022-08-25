# Javascript AJAX (ajax.js)

[![Latest Stable Version](https://img.shields.io/badge/Stable-v1.0.9-brightgreen.svg?style=plastic)](https://github.com/tomFlidr/ajax.js/releases)
[![License](https://img.shields.io/badge/Licence-MIT-brightgreen.svg?style=plastic)](https://github.com/tomFlidr/ajax.js/blob/master/LICENSE.md)

## **INSTALATION**

```shell
npm install ajax-min
```

## **DOWNLOAD**

* [**download ajax.min.js (for production)**](https://tomflidr.github.io/ajax.js/builds/1.0.9/ajax.min.js)
* [**download ajax.dev.js (for development with JSDocs comments for IDE)**](https://tomflidr.github.io/ajax.js/builds/1.0.9/ajax.dev.js)
* [**download ajax.d.ts (for development in TypeScript with JSDocs comments for IDE)**](https://tomflidr.github.io/ajax.js/builds/1.0.9/ajax.d.ts)

```html
<!-- for production: -->
<script type="text/javascript" src="https://tomflidr.github.io/ajax.js/builds/1.0.9/ajax.min.js"></script>

<!-- for development with JSDocs comments for IDE: -->
<script type="text/javascript" src="https://tomflidr.github.io/ajax.js/builds/1.0.9/ajax.dev.js"></script>
```

## **DEMOS**
- [1. Basic GET Example](http://github.tomflidr.cz/ajax.js/demos/01-basic-get.html)
- [2. Basic POST Example](http://github.tomflidr.cz/ajax.js/demos/02-basic-post.html)
- [3. Universal Load Example](http://github.tomflidr.cz/ajax.js/demos/03-complete-load.html)
- [4. Foreing Domain JSONP Request Example](http://github.tomflidr.cz/ajax.js/demos/04-foreing-domain-jsonp.html)
- [5. Multiple Requests With Global Handlers Example](http://github.tomflidr.cz/ajax.js/demos/05-multiple-requests-with-global-handlers.html)

Very effective, supersmall, cross browser AJAX library, supporting JSON, JSONP, XML, HTML or TEXT requesting or returning result type by HTTP header Content-Type, automatic data serialization, automatic evaluation by recognized type, global handlers and syntax based on jQuery.ajax();.

## **FEATURES**

- very effective, super small javascript AJAX library - all in 460 lines, **minimized: 8.3 KB**, **gzipped: 3.3 KB**
- **syntax based on jQuery.ajax();**, `Ajax.load();`, `Ajax.get();`, `Ajax.post();`, no promisses, returning `XmlHttpRequest`
- supported browsers: **MSIE6+, Firefox, Chrome, Safari, Opera and mobile browsers**
- **highly optimized**
- all request methods supported - **`GET`, `POST`, `HEAD`, `OPTION`, `...`**
  - but only **`GET`** in **`JSONP`** request type (**by \<stript\> tag**, to request foreing domains without any other settings)
- still possible to request diferent domains with http header: **`"Access-Control-Allow-Origin"`**
- **automatic `JSON` serialization** into format: `key1=value1&key2=["anything",{"with":["JSON","structure"]}]` 
- data always **sended with HTTP headers**:
  - **`X-Requested-With: XmlHttpRequest`** (posibile to change)
  - **`Content-Type: application/x-www-form-urlencoded`** (posibile to change)
- **`JSON` evaluation and `XML`/`HTML` parsing** into environment types by type param
- **automatic result conversion by response HTTP header `"Content-Type"`** into `JSON`/`XML`/`HTML`/`TEXT` if no `type` option defined
- posibility to **change any http header before** send **and read any header after** data are loaded or error handled (except cookies header:-)
- posibility to change async requesting to sync (but it is not recomanded, by default is async)
- **global handlers for each request** to set up error loging or loading animations:
  - `Ajax.beforeLoad(function(xhr, requestId, url, typ){});`
  - `Ajax.onSuccess(function(xhr, requestId, url, type){});`
  - `Ajax.onAbort(function(data, statusCode, xhr, requestId, url, type){});`
  - `Ajax.onError(function(responseText, statusCode, xhr, errorObject, errorEvent, requestId, url, type){});`

## **USAGE**

Include JAVASCRIPT file **`ajax.min.js`** into your HTML page in `\<head\>` section, no other library is necessary:

```html
<script type="text/javascript" src="https://tomflidr.github.io/ajax.js/builds/1.0.9/ajax.min.js"></script>
```

Or include JAVASCRIPT file **`ajax.min.js`** into your project by `require()` function implemented by your own:
```js
var Ajax = require('./node_modules/ajax-min/builds/latest/ajax.min.js').Ajax;
```

If you are using **TypeScript**, add to your `tsconfig.json` file:
```js
{
  "compilerOptions": {
    "typeRoots": [
	  "./node_modules/",
	],
    "types": [
      "ajax-min"
    ],
  },
}
```


### Universal Syntax

#### Basic Syntax

Standard browser window.XMLHttpRequest object is returned, for **`JSONP`** requests is returned object described later.

```javascript
// into xhr is returned XMLHttpRequest instance, in MSIE 8- ActiveObject instance is returned
var xhr = Ajax.load({
    url: '',              // string, required
    method: '',           // string, not required, default: 'get'
    data: {},             // object (to be serialized), not required, default: {}
    success: function(){},// function, not required, default: 
                          // function(data,statusCode,xhr,requestId,url,type){}
    type: '',             // string, not required, default: ''
                          // (if empty string, result is processed by Content-Type HTTP header)
    error: function(){},  // function, not required, default: 
                          // function(responseText,statusCode,xhr,errorObject,errorEvent,requestId,url,type){}
    headers: {},          // object, not required, default: {},
    async: true           // boolean, not required, default: true
});
```
#### Full Example

[**VIEW DEMO**](http://github.tomflidr.cz/ajax.js/demos/03-complete-load.html)

Create any *.html file in base project directory and paste this code into \<script\> tag:

```html
<div id="result"></div>
<script type="text/javascript">
    var xhr = Ajax.load({
        // required - relative or absolute path
        url: 'demos/data/json.php',
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
        success: function (data, statusCode, xhr, requestId, url, type) {
            // print data - beautiful indented output with third param
            result.innerHTML = "<pre><code>Result data:\n" +  JSON.stringify(data, null, 4) + "</code></pre>";
        },
        // not required, possible values: JSON, JSONP, XML, HTML, TEXT, 
        // if not set, data are parsed/evaluated by HTTP header
        type: 'json',
        // not required, custom callback for error
        error: function (responseText, statusCode, xhr, requestId, url, type) {
            console.log(arguments);
        },
        // not required, true by default
        async: true,
        // not required, http headers to overwrite before data are sended, empty object by default
        headers: {
            // 'Content-Type': 'multipart/form-data'
        }
    });
</script>
```

### GET Request

#### Basic Syntax

Standard browser window.XMLHttpRequest object is returned, for JSONP requests is returned object described later.

```javascript
// into xhr is returned XMLHttpRequest instance, in MSIE 8- ActiveObject instance is returned
var xhr = Ajax.get(
    url,     // string, required
    data,    // object (to be serialized), default: {}, not required
    success, // function, default: function(data, statusCode, xhr, requestId, url, type){}, not required
    type,    // string, default: '' (result is be evaluated/parsed by Content-Type HTTP header), not required
    error,   // function, default: function(responseText, statusCode, xhr, requestId, url, type){}, not required
    headers, // object, default: {}, not required
    async    // boolean, default: true, not required
);
```
#### Full Example

[**VIEW DEMO**](http://github.tomflidr.cz/ajax.js/demos/01-basic-get.html)

Create any *.html file in base project directory and paste this code into \<script\> tag:

```html
<div id="result"></div>
<script type="text/javascript">
    var xhr = Ajax.get(
        // required - relative or absolute path
        'demos/data/json.php',
        // not required, any structured data are automaticly stringified 
        // by JSON.stringify() included in this library
        {
            key1: "value1",
            key2: [
                "anything",
                {"with": ["JSON", "structure"]}
            ]  
        },
        // not required, custom callback for success, data are automaticly 
        // evaluated or parsed by type param or HTTP header
        function (data, statusCode, xhr, requestId, url, type) {
            // print data - beautiful indented output with third param
            result.innerHTML = "<pre><code>Result data:\n" +  JSON.stringify(data, null, 4) + "</code></pre>";
        },
        // not required, possible values: JSON, JSONP, XML, HTML, TEXT, 
        // if not set, data are parsed/evaluated by HTTP header
        'json',
        // not required, custom callback for error
        function (responseText, statusCode, xhr, requestId, url, type) {
            console.log(arguments);
        }
    );
</script>
```

### POST Request

#### Basic Syntax

Standard browser window.XMLHttpRequest object is returned, for JSONP requests is returned object described later.

```javascript
// into xhr is returned XMLHttpRequest instance, in MSIE 8- ActiveObject instance is returned
var xhr = Ajax.post(
    url,     // string, required
    data,    // object (to be serialized), default: {}, not required
    success, // function, default: function(data, statusCode, xhr, requestId, url, type){}, not required
    type,    // string, default: '' (result is be evaluated/parsed by Content-Type HTTP header), not required
    error,   // function, default: function(responseText, statusCode, xhr, requestId, url, type){}, not required
    headers, // object, default: {}, not required
    async    // boolean, default: true, not required
);
```

#### Full Example

[**VIEW DEMO**](http://github.tomflidr.cz/ajax.js/demos/02-basic-post.html)

Create any *.html file in base project directory and paste this code into \<script\> tag:

```html
<div id="result"></div>
<script type="text/javascript">
    var xhr = Ajax.post(
        // required - relative or absolute path
        'demos/data/xml.php',
        // not required, any structured data are automaticly stringified 
        // by JSON.stringify() included in this library
        {
            key1: "value1",
            key2: [
                "anything",
                {"with": ["JSON", "structure"]}
            ]  
        },
        // not required, custom callback for success, data are automaticly 
        // evaluated or parsed by type param or HTTP header
        function (data, statusCode, xhr, requestId, url, type) {
            // print xml root element object as string
            result.innerHTML = "<pre><code>Result data:\n"
                + data.documentElement.outerHTML.replace(/\</g, '&lt;').replace(/\>/g, '&gt;') 
                + "</code></pre>";
        },
        // not required, possible values: JSON, JSONP, XML, HTML, TEXT, 
        // if not set, data are parsed/evaluated by HTTP header
        'xml',
        // not required, custom callback for error
        function (responseText, statusCode, xhr, requestId, url, type) {
            console.log(arguments);
        }
    );
</script>
```

### GET JSONP Request

#### Description

For all requests with return type initialized with JSONP value is not created standard instance from browser's window.XMLHttpRequest, but there is created temporary \<script\> tag in \<head\> section of your HTML file to safely include script resource from foreing domain without any broser security Error thrown. You can load data from foreing domains also by using HTTP header "Access-Control-Allow-Origin", but it's not what is necessary to describe here. 
To be clear - **there is possible with JSONP to use only GET method** - to send and load data from foreing domain. So be careful, there are some [**limitations for url length**](https://support.microsoft.com/cs-cz/kb/208427), because all params are contained in url. 

Before \<script\> tag is appended into \<head\> section, there is initialized **temporary public function** in **window.Ajax.JsonpCallback[X]** to handle incoming script content. Name of this public function is sended to foreing server in GET param named as "&callback=Ajax.JsonpCallback[X]". Ajax library presume, that server always return only content with only this public function call with first argument containing result data. Be careful for server trust, there should be anything else, but it doesn't happend (but it's only a different way how to say - it happends:-). After script is loaded by browser, initialized in \<head\> section, then prepared public function is called. Temporary \<script\> tag is removed, public function is also deleted and your custom callback is called.

##### Return Type

Ajax.load() and Ajax.get() will not return any xhr object if you use JSONP data type to return. There is returned javascript object with three properties:

```javascript
var jsonpReq = {
    url   // string, complete script tag str url
    id    // number, request id
    abort // function, library function to abort JSONP request
};
```

If you want to manipulate with this kind of request resources, be free to do anything. Read more in source lines in function "_processScriptRequest". But to abort JSONP request - it's just only necessrry to:

```javascript
var jsonpReq.abort();
```

#### Full Example

[**VIEW DEMO**](http://github.tomflidr.cz/ajax.js/demos/04-foreing-domain-jsonp.html)

```javascript
var jsonpReq = Ajax.get(
    'https://tomflidr.github.io/ajax.js/demos/data/books.json',
    {
        key1: "value1",
        key2: [
            "anything",
            {"with": ["JSON", "structure"]}
        ]  
    },
    function (data, statusCode, xhr, requestId, url, type) {
        console.log(arguments);
    },
    'jsonp'
);
// to abort request any time - use:
jsonpReq.abort();
// jsonpReqCtrl.abort(); removes \<script\>tag from \< head\>section, unset global handler 
```

### Global Handlers

#### Add Global Handler

There is called queue of handlers before each request by window.XMLHttpHeader object and also before each request by JSONP requesting throught \<script\> tags. Also there is called a queue of handlers after each success response for these request types. To add any handler function, see full example bellow.

#### Full Example

[**VIEW DEMO**](http://github.tomflidr.cz/ajax.js/demos/05-multiple-requests-with-global-handlers.html)

```javascript
// not required - add function into queue called before each request type
Ajax.beforeLoad(function (xhr, requestId, url, type) {
    // xhr - XMLHttpRequest | ActiveXObject | null - browser request obj. or null before JSONP request
    // requestId - number - request id
    // url - string - full requested url
    // type - string - initialized response type or empty string
    document.body.style.cursor = 'wait !important';
});

// not required - add function into queue called after request is aborted by programmer
Ajax.onAbort(function (xhr, requestId, url, type) {
    // xhr - XMLHttpRequest | ActiveXObject | null - browser request obj. or null before JSONP request
    // requestId - number - request id
    // url - string - full requested url
    // type - string - initialized response type or empty string
    document.body.style.cursor = 'default';
});

// not required - add function into queue called after each success request type
Ajax.onSuccess(function (data, statusCode, xhr, requestId, url, type) {
    // data - mixed - evaluated or parsed result data, shoud be js object, array, xml document or text
    // statusCode - number - http status code
    // xhr - XMLHttpRequest | ActiveXObject | null - browser request obj. or null before JSONP request
    // requestId - number - request id
    // url - string - full requested url
    // type - string - initialized response type or empty string
    document.body.style.cursor = 'default';
});

// not required - add function into queue called after each error request type
Ajax.onError(function (responseText, statusCode, xhr, errorObject, errorEvent, requestId, url, type) {
    // responseText - string - raw response text string or empty string
    // statusCode - number - http status code
    // xhr - XMLHttpRequest | ActiveXObject | null - browser request obj. or null before JSONP request
    // errorObject - javascript error - should be trown and catched by json evaluation or xml parsing
    // errorEvent - javascript error event - should be created by JSONP request type loading error
    // requestId - number - request id
    // url - string - full requested url
    // type - string - initialized response type or empty string
    console.log(arguments);
});
```

All global handlers return Ajax library declaration function, so it's possible to init global handlers like:

```javascript
Ajax.beforeLoad(function (xhr, requestId, url, type) {
    document.body.style.cursor = 'wait !important';
}).onAbort(function (xhr, requestId, url, type) {
    document.body.style.cursor = 'wait !important';
}).onSuccess(function (data, statusCode, xhr, requestId, url, type) {
    document.body.style.cursor = 'default';
}).onError(function (responseText, statusCode, xhr, errorObject, errorEvent, requestId, url, type) {
    console.log(arguments);
});
```

#### Remove Global Handler

Handlers are stored in arrays placed in:

```javascript
Ajax.handlers.before = [];
Ajax.handlers.abort = [];
Ajax.handlers.success = [];
Ajax.handlers.error = [];
```

Feel free to use them as standard plain JS arrays to add or remove any handler anytime. There are no any static functions on Ajax object to remove handlers, so it's necessary to do it (if you want) by:

```javascript
delete Ajax.handlers.before[yourDesireIndex];
```

### Public Static Properties

#### Ajax.defaultHeaders

HTTP default headers sended in each request by XMLHttpRequest, not in JSONP requesting.
Feel free to change it.

```javascript
Ajax.defaultHeaders = {
    'X-Requested-With': 'XmlHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded'
};
```

#### Ajax.jsonpCallbackParam

JSONP requesting GET param name how to say name of public callback function to server.
Specific name of the function is generated by library. As default library uses name 'callback'.
Most of JSON APIs uses standard naming convention - 'callback' value, but sometimes should be handy to change it.

```javascript
Ajax.jsonpCallbackParam = 'callback';
```

## **LIBRARY DEVELOPMENT**
- This library doesn't need any dependency.
- To open project file in Visual Studio, you need to install [PowerShell Tools for Visual Studio](https://marketplace.visualstudio.com/search?term=PowerShell%20Tools%20for%20Visual%20Studio&target=VS&category=All%20categories&vsVersion=&sortBy=Relevance):
- To build development and minimalized version, you need to run:
  - `devel-tools/make-dev-version-from-src.cmd`
  - `devel-tools/make-min-version-from-src.cmd`
  