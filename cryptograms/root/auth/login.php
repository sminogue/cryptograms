<?php

session_start();

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

//execute post
$result = curl_exec($ch);

//close connection
curl_close($ch);

$result = substr($result, 0, -1);

echo $result;

?>