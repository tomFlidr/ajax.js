<?php

	include_once(__DIR__ . '/base.php');

	// init formating function to convert php array and stdClass into xml string
	function formatParams ($data, $level = 2) {
		$s = ''; $indent = ''; $i = 0;
		while ($i++ < $level) $indent .= "\t";
		foreach ($data as $key => $value) {
			$nodeName = is_numeric($key) ? 'item' : $key;
			if (gettype($value) == 'string') {
				$s .= $indent.'<'.$nodeName.'>'.$value.'</'.$nodeName.'>'."\n";
			} else {
				$s .= $indent.'<'.$nodeName.'>'."\n".formatParams($value, $level + 1).$indent.'</'.$nodeName.'>'."\n";
			}
		}
		return $s;
	}
	
	// convert all sended params into xml string
	$paramsStr = formatParams($params);
	
	// process replacements on raw xml string
	// - wrap <books> node into new root node and prepend into root node params xml string
	$out = str_replace(
		array("\t", "<books>", "</books>",),
		array("\t\t", "<data>\n\t<params>\n".$paramsStr."\t</params>\n\t<books>", "\t</books>\n</data>",),
		$booksXml
	);
	
	// send xml string with proper http headers
	header('Content-Type: application/xml; charset=utf-8');
	header('Content-Length: ' . strlen($out));
	echo $out;