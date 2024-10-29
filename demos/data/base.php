<?php
	
	/**
	 * Complete all params into one array.
	 */
	function decodeParams () {
		$params = array_merge([], $_GET);
		$inputStr = file_get_contents('php://input');
		$inputJson = FALSE;
		// if params are send as direct input - deserialize it
		if ($inputStr !== FALSE && mb_strlen($inputStr) > 0) {
			try {
				$input = json_decode($inputStr, JSON_OBJECT_AS_ARRAY);
				if (is_array($input) && count($input) > 0) {
					$params = array_merge($params, $input);
					$inputJson = TRUE;
				}
			} catch (\Exception $e) {}
		}
		if (!$inputJson) {
			$params = array_merge($params, $_POST);
			// there could be param under key "key2" (from examples) 
			// serialized in json - deserialize it
			if (isset($params['key2'])) {
				if (is_string($params['key2'])) {
					$params['key2'] = json_decode($params['key2']);
				} else if (is_array($params['key2'])) {
					$key2 = [];
					foreach ($params['key2'] as $key2Key => $key2Item)
						$key2[$key2Key] = json_decode($key2Item, JSON_OBJECT_AS_ARRAY);
					$params['key2'] = $key2;
				}
			}
		}
		return $params;
	}

	// load xml as string
	$booksXml = file_get_contents(__DIR__ . '/books.xml');
	$booksJson = json_decode(file_get_contents(__DIR__ . '/books.json'));
	
	$params = decodeParams();
	
	// if there is any sleep param - sleep stript
	if (isset($params['sleep'])) {
		$seconds = intval($params['sleep']);
		sleep($seconds);
	}
	
	