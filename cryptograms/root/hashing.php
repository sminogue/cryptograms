<?php

define("HASH_ALGORITHM", "sha256");
define("ITERATIONS", 1000);
define("SALT","theblackchamber");

function create_hash($password)
{
	
	$hashedString = $password;
	
	for($i = 0;$i<1000;$i++){
		
		$hashedString = hash(HASH_ALGORITHM, (SALT . $hashedString));
		
	}
	
	return $hashedString;	
}


// Compares two strings $a and $b in length-constant time.
function slow_equals($a, $b)
{
    $diff = strlen($a) ^ strlen($b);
    for($i = 0; $i < strlen($a) && $i < strlen($b); $i++)
    {
        $diff |= ord($a[$i]) ^ ord($b[$i]);
    }
    return $diff === 0; 
}