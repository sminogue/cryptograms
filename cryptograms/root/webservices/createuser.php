<?php

try{

	// Include the main Propel script
	require_once '/usr/local/propelorm/runtime/lib/Propel.php';
	require_once '../hashing.php';

	// Initialize Propel with the runtime configuration
	Propel::init("../build/conf/cryptogram-conf.php");

	// Add the generated 'classes' directory to the include path
	set_include_path("../build/classes" . PATH_SEPARATOR . get_include_path());

	$email = $_REQUEST['email'];
	$password = $_REQUEST['password'];

	//Sleep for half a second so this WS cant be used to probe for valid email addresses
	//NOTE this will not stop that use... but will take long enough to not be a good
	//attack vector.
	usleep(500);

	//Verify the email address isnt already in use
	$users = UserQuery::create()->filterByEmail($email)->find();

	if (!($users->isEmpty())){
		$arr = array ('result'=>false,'message'=>'The specified email address is already associated with another account.');
		echo json_encode($arr);
		exit();
	}

	//Hash password
	$hashedPassword = create_hash($password);

	//Insert user into the database
	$user = new User();
	$user->setEmail($email);
	$user->setPassword($hashedPassword);
	$user->save();

	$arr = array ('result'=>true);
	echo json_encode($arr);
	
}catch(Exception $e){
	$arr = array ('result'=>false,'message'=>'Failed to create user due to an internal error. Please try again.');
	echo json_encode($arr);
}

?>