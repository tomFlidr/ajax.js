<?php

	include_once(__DIR__ . '/base.php');
	
	// get posted data
	$encodedParams = json_decode($params['params']);
	
	// get url from original domain to redirect into
	$responseUrl = $params['responseUrl'];
	
	// get javascript callbackKey and callbackValue
	$callbackKey = $params['callbackKey'];
	$callbackValue = $params['callbackValue'];
	
	// encode all variables into one json string
	$out = json_encode(
		array(
			'params'=> $encodedParams, 
			'json'	=> $booksJson,
		)
	);
	
	// send json result string in encoded in location.hash in original domain blank page
	header("HTTP/1.0 301 See Other");
	header("Location: " . $responseUrl . '#' . $callbackKey . '=' . $callbackValue . '&params=' . $out);
	die();								  #callback=publicWindowFunctionName&params=...