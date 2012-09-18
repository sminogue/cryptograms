<?php

class PuzzleResponse {
	public $cipherText,$cipher,$reverseCipher,$clearText,$result;
}

session_start();

$submittedSolution = $_REQUEST["solution"];

$solution = $_SESSION["solution"];

$puzzleResponse = new PuzzleResponse();
$puzzleResponse->cipherText = $_SESSION['cipherText'];;
$puzzleResponse->cipher = $_SESSION['cipher'];
$puzzleResponse->clearText = $solution;
$puzzleResponse->reverseCipher = $_SESSION['reverseCipher'];

if($solution === $submittedSolution){
	$puzzleResponse->result = true;
	echo json_encode($puzzleResponse);
}else{
	$puzzleResponse->result = false;
	echo json_encode($puzzleResponse);
}


?>