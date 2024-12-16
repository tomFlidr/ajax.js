Here’s an improved version with minor corrections and enhancements for clarity:

---

# Javascript AJAX (ajax.js)

[![Latest Stable Version](https://img.shields.io/badge/Stable-v1.0.16-brightgreen.svg?style=plastic)](https://github.com/tomFlidr/ajax.js/releases)
[![License](https://img.shields.io/badge/License-MIT-brightgreen.svg?style=plastic)](https://github.com/tomFlidr/ajax.js/blob/master/LICENSE.md)

## **INSTALLATION**

```shell
npm install ajax-min
```

## **DOWNLOAD**

* [**Download ajax.min.js (for production)**](https://cdn.jsdelivr.net/gh/tomFlidr/ajax.js@v1.0.16/builds/latest/ajax.min.js)
* [**Download ajax.dev.js (for development with JSDoc comments for IDEs)**](https://cdn.jsdelivr.net/gh/tomFlidr/ajax.js@v1.0.16/builds/latest/ajax.dev.js)
* [**Download ajax.d.ts (for development in TypeScript with JSDoc comments for IDEs)**](https://cdn.jsdelivr.net/gh/tomFlidr/ajax.js@v1.0.16/builds/latest/ajax.d.ts)

```html
<!-- for production: -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/tomFlidr/ajax.js@v1.0.16/builds/latest/ajax.min.js"></script>

<!-- for development with JSDoc comments for IDE: -->
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/tomFlidr/ajax.js@v1.0.16/builds/latest/ajax.dev.js"></script>
```

## **DEMOS**
- [1. Basic GET Example](http://github.tomflidr.cz/ajax.js/demos/01-basic-get.html)
- [2. Basic POST Example](http://github.tomflidr.cz/ajax.js/demos/02-basic-post.html)
- [3. Universal Load Example](http://github.tomflidr.cz/ajax.js/demos/03-complete-load.html)
- [4. Foreign Domain JSONP Request Example](http://github.tomflidr.cz/ajax.js/demos/04-foreign-domain-jsonp.html)
- [5. Multiple Requests With Global Handlers Example](http://github.tomflidr.cz/ajax.js/demos/05-multiple-requests-with-global-handlers.html)

A highly efficient, ultra-compact, cross-browser AJAX library that supports JSON, JSONP, XML, HTML, or TEXT request/response types based on HTTP headers, with automatic data serialization, type evaluation, global handlers, and jQuery.ajax()-like syntax.

## **FEATURES**

- Very efficient, super small JavaScript AJAX library - all in 760 lines, **minified: 9.3 KB**, **gzipped: 4.0 KB**
- **jQuery.ajax()-like syntax**, `Ajax.load();`, `Ajax.get();`, `Ajax.post();`, no promises, returns `XMLHttpRequest`
- Supported browsers: **MSIE6+, Firefox, Chrome, Safari, Opera, and mobile browsers**
- **Highly optimized**
- All request methods supported - **`GET`, `POST`, `HEAD`, `OPTION`, etc.**
  - Only **`GET`** in **`JSONP`** request type (using a `<script>` tag to request foreign domains without further configuration)
- Supports cross-domain requests using the HTTP header: **`"Access-Control-Allow-Origin"`**
- **Automatic `JSON` serialization** in the format: `key1=value1&key2=["anything",{"with":["JSON","structure"]}]`
- Data always **sent with HTTP headers**:
  - **`X-Requested-With: XMLHttpRequest`** (configurable)
  - **`Content-Type: application/x-www-form-urlencoded`** (configurable)
- **`JSON` evaluation and `XML`/`HTML` parsing** based on the `type` parameter
- **Automatic result conversion based on the response's HTTP header `"Content-Type"`** to `JSON`/`XML`/`HTML`/`TEXT` if no `type` option is defined
- Ability to **modify any HTTP header before sending** and **read any header after** data loads or errors occur (excluding cookies)
- Option to switch from asynchronous to synchronous requests (not recommended, async by default)
- **Global handlers for each request** to set up error logging or loading animations:
  - `Ajax.beforeLoad(function(xhr, requestId, url, type){});`
  - `Ajax.onSuccess(function(xhr, requestId, url, type){});`
  - `Ajax.onAbort(function(data, statusCode, xhr, requestId, url, type){});`
  - `Ajax.onError(function(responseText, statusCode, xhr, errorObject, errorEvent, requestId, url, type){});`

## **USAGE**

Include the **`ajax.min.js`** JavaScript file in the `<head>` section of your HTML page. No other libraries are necessary:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/gh/tomFlidr/ajax.js@v1.0.16/builds/latest/ajax.min.js"></script>
```

Or include it in your project with `require()` if implemented in your setup:
```js
var Ajax = require('./node_modules/ajax-min/builds/latest/ajax.min.js').Ajax;
```

If using **TypeScript**, add to your `tsconfig.json` file:
```js
{
  "compilerOptions": {
    "paths": [
      "ajax-min": ["./node_modules/ajax-min/builds/latest/ajax.d.ts"]
    ]
  }
}
```

### Universal Syntax

#### Basic Syntax

The `XMLHttpRequest` object is returned. For **`JSONP`** requests, an object described later is returned.

```javascript
// `xhr` contains the XMLHttpRequest instance; in MSIE 8-, it contains an ActiveObject instance.
var xhr = Ajax.load({
    url: '',              // string, required
    method: '',           // string, optional, default: 'GET'
    data: {},             // object (to be serialized), optional, default: {}
    success: function(){},// function, optional, default: 
                          // function(data, statusCode, xhr, requestId, url, type){}
    type: '',             // string, optional, default: ''
                          // (if empty string, result is determined by Content-Type HTTP header)
    error: function(){},  // function, optional, default: 
                          // function(responseText, statusCode, xhr, errorObject, errorEvent, requestId, url, type){}
    headers: {},          // object, optional, default: {},
    async: true           // boolean, optional, default: true
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
delete Ajax.handlers.before[yourDesiredIndex];
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

<br /><br />
#### **DEV OPS**

This library is standalone and has no dependencies. 
To generate development or minified versions, follow these instructions:

- **Windows:**
  - For development version: `call devel-tools/make-dev-version-from-src.cmd`
  - For minified version: `call devel-tools/make-min-version-from-src.cmd`

- **Linux:**
  - For development version: `sh devel-tools/make-dev-version-from-src.sh`
  - For minified version: `sh devel-tools/make-min-version-from-src.sh`
