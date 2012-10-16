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
require_once '../utilities.php';

// Initialize Propel with the runtime configuration
Propel::init("../build/conf/cryptogram-conf.php");

// Add the generated 'classes' directory to the include path
set_include_path("../build/classes" . PATH_SEPARATOR . get_include_path());

$assertion = $_POST['assertion'];

//set POST variables
$url = 'https://verifier.login.persona.org/verify';
$fields = array(
            'assertion' => urlencode($assertion),
            'audience' => urlencode('http://local.theblackchamber.net:80')
);

$fields_string = '';

//url-ify the data for the POST
foreach($fields as $key=>$value) { $fields_string .= $key.'='.$value.'&'; }
rtrim($fields_string, '&');

//open connection
$ch = curl_init();

//set the url, number of POST vars, POST data
curl_setopt($ch,CURLOPT_URL, $url);
curl_setopt($ch,CURLOPT_POST, count($fields));
curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

//execute post
$response = curl_exec($ch);
$status = curl_getinfo($ch);

//close connection
curl_close($ch);

handleUser(json_decode($response));

echo $response;


function handleUser($userObj){

	$email = $userObj->email;

	$users = UserQuery::create()->filterByEmail($email)->find();
	$user = null;
	if (($users->isEmpty())){
		$user = new User();
		$user->setEmail($email);
		$user->save();
	}else{
		$users = UserQuery::create()->filterByEmail($email)->find();
		$user = $users[0];
	}

	//Stash logged in user into session
	$_SESSION['USER'] = $user;

}



?>