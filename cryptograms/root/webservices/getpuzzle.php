<?php
session_start();

//Fetch puzzle from DB
$clearText = "sam i am, i eat green eggs and ham";

//Store puzzle solution in the session
$_SESSION['solution'] = ereg_replace("[^A-Za-z]", "", $clearText );;

//Create new alphabet
$cipher = createCipher();

//create cipher stream by encrypting cleartext
$cipherText = encryptString($clearText, $cipher);

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