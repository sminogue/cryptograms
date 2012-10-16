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
session_start();

// Include the main Propel script
require_once '/usr/local/propelorm/runtime/lib/Propel.php';

// Initialize Propel with the runtime configuration
Propel::init("../build/conf/cryptogram-conf.php");
	
// Add the generated 'classes' directory to the include path
set_include_path("../build/classes" . PATH_SEPARATOR . get_include_path());

//Fetch puzzle from DB
$cryptogram = CryptogramQuery::create()
	->findPk(1);

$clearText = $cryptogram->getClearText();

//Store puzzle solution in the session
$_SESSION['solution'] = ereg_replace("[^A-Za-z]", "", $clearText );;

//Create new alphabet
$cipher = createCipher();
$reverseCipher = reverseCipher($cipher);

$_SESSION['cipher'] = $cipher;
$_SESSION['reverseCipher'] = $reverseCipher;

//create cipher stream by encrypting cleartext
$cipherText = encryptString($clearText, $cipher);

$_SESSION['cipherText'] = $cipherText;

//split cipher stream into words
$cipherWords = explode(" ", $cipherText);

//Build 2d array of words
$col = 0;
$row = array();
$rows = array();

foreach($cipherWords as $cipherWord){

	if($col > 0 &&  $col % 4 == 0){

		array_push($rows, trim(implode(' ',$row)));
		unset($row);
		$row = array();
		array_push($row, $cipherWord);
		$col = 1;

	}else{

		array_push($row, $cipherWord);
		$col++;

	}

}

array_push($rows, trim(implode(' ',$row)));

//Convert 2d array into json string
$jsonString = json_encode($rows);

//Return json to client.
echo $jsonString;

/*
 * ---------------------------------------
 * Helper functions
 * ---------------------------------------
 */

function encryptString($clearText, $cipher){

	$clearChars = str_split($clearText);

	$encryptedString = "";

	foreach ($clearChars as $char){

		$cipherChar = $cipher[$char];

		if($cipherChar == ''){
			$encryptedString .= $char;
		}else{
			$encryptedString .= $cipherChar;
		}



	}

	return $encryptedString;

}

function reverseCipher($cipher){
	
	$reverseCipher = array();
	$array_keys = array_keys($cipher);
	
	foreach($array_keys as $key){
		$reverseCipher[$cipher[$key]] = $key;       
	}

	return $reverseCipher;
	
}

function createCipher() {
	$alphabet = array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");
	$cipherAlphabet = $alphabet;

	shuffle($cipherAlphabet);

	$cryptoTable = array();

	for ($i = 0; $i <= 25; $i++) {

		$cryptoTable[$alphabet[$i]] = $cipherAlphabet[$i];

	}

	return $cryptoTable;

}

?>