var xhr = Ajax.get(
	// required - relative or absolute path
	'../data/json.php',
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
	(data, statusCode, xhr, requestId, url, type) => {
		// print data - beautiful indented output with third param
		document.querySelector('#result').innerHTML = "<pre><code>Result data:\n" +  JSON.stringify(data, null, 4) + "</code></pre>";
	},
	// not required, possible values: JSON, JSONP, XML, HTML, TEXT, 
	// if not set, data are parsed/evaluated by HTTP header
	'json',
	// not required, custom callback for error
	(responseText, statusCode, xhr, requestId, url, type) => {
		console.log(responseText, statusCode);
	}
);