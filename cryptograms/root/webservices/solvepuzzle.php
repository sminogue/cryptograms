<?php

session_start();

$submittedSolution = $_REQUEST["solution"];

$solution = $_SESSION["solution"];

if($solution === $submittedSolution){
	echo 'true';
}else{
	echo 'false';
}


?>