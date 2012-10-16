<?php
/*
 * Copyright (c) 2012 Seamus Minogue. All Rights Reserved.
 * 
 * This file is part of Cryptograms.
 *
 * Cryptograms is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * My Library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cryptograms.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

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