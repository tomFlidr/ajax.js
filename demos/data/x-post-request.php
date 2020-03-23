<?php

	// load raw json from hard drive
	$books = json_decode(file_get_contents(__DIR__ . '/books.js'));
	
	// complete all params into one array
	$rawInput = array_merge($_GET, $_POST);
	
	// if there is any sleep param - sleep stript
	if (isset($rawInput['sleep'])) {
		$seconds = intval($rawInput['sleep']);
		sleep($seconds);
	}
	
	// get posted data
	$encodedParams = json_decode($rawInput['params']);
	
	// get url from original domain to redirect into
	$responseUrl = $rawInput['responseUrl'];
	
	// get javascript callbackKey and callbackValue
	$callbackKey = $rawInput['callbackKey'];
	$callbackValue = $rawInput['callbackValue'];
	
	// encode all variables into one json string
	$out = json_encode(
		array(
			'params'=> $encodedParams, 
			'json'	=> $books,
		)
	);
	
	// send json result string in encoded in location.hash in original domain blank page
	header("HTTP/1.0 301 See Other");
	header("Location: " . $responseUrl . '#' . $callbackKey . '=' . $callbackValue . '&params=' . $out);
	die();								  #callback=publicWindowFunctionName&params=...