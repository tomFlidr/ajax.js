<?php

	include_once(__DIR__ . '/base.php');
	
	// encode all variables into one json string
	$out = json_encode(
		array(
			'params'=> $params, 
			'json'	=> $booksJson,
		)
	);
	
	// send json result string with proper http headers
	header('Content-Type: application/json; charset=utf-8');
	header('Content-Length: ' . strlen($out));
	echo $out;