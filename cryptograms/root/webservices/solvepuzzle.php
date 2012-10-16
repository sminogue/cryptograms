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
 * Cryptograms is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Cryptograms.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */
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