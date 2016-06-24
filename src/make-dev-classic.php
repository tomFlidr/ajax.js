<?php
	$source = __DIR__ . '/ajax.google.closure.src.js';
	$classic = __DIR__ . '/ajax.dev.classic.js';
	$src = file_get_contents($source);
	while (true) {
		preg_match("#\[\'([^']*)\'\]#", $src, $matches);
		if (!$matches) break;
		$src = preg_replace("#\[\'([^']*)\'\]#", ".$1", $src);
	}
	unlink($classic);
	file_put_contents($classic, $src);
	