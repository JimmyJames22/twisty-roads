<?php
	$type = htmlspecialchars($_GET["type"]);
		switch ($type){
		case 'login':
			echo "logging in<br>";
			break;
		case 'routed':
			echo "logged route<br>";
			break;
		case 'driving-style':
			echo "logged speed<br>";
			break;
		default:
			echo "INCORRECT PARAMS!!!!!!<br>";
	}
	$servername = "localhost:3306";
	$username = "root";
	$password = "teachmeSQL";

	// Create connection
	$conn = new mysqli($servername, $username, $password);
	// when there is a password, do $conn = mysqli_connect($servername, $username, $password);	$conn = mysqli_connect($servername, $username);


	// Check connection
	if (!$conn) {
	  die("Connection failed: " . mysqli_connect_error()) . "<br>";
	}
	echo "Connected successfully<br>";

	//check if db users exists
	if (mysqli_select_db($conn, 'users')) {
		echo "Database exists<br>";
	} else {
		$sql = "CREATE DATABASE users";
		if ($conn->query($sql) === TRUE) {
		echo "Database created successfully<br>";
		} else {
		echo "Error creating database: " . $conn->error . "<br>";
		}
	}

	mysqli_select_db($conn, 'users');

	//check if table exists
	// $test = mysqli_query($conn, 'select i from `userlist`');
	if(mysqli_query($conn, "DESCRIBE `userlist`")){
		echo "userlist TABLE EXISTS<br>";
	} else {
		$query = "CREATE TABLE userlist (firstname VARCHAR(30), lastname VARCHAR(30), email VARCHAR(70), phone VARCHAR(12), clientid INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY)";
		if($conn -> query($query) === TRUE){
			echo "userlist TABLE MADEE<br>";
		} else {
			echo "Error creating table: " . $conn.error . "<br>";
		}
	}

	if(mysqli_query($conn, "DESCRIBE `userlogin`")){
		echo "userlogin TABLE EXISTS<br>";
	} else {
		$query = "CREATE TABLE userlogin (email VARCHAR(70), password VARCHAR(30), clientid INT(10))";
		if($conn -> query($query) === TRUE){
			echo "userlogin TABLE MADEE<br>";
		} else {
			echo "Error creating table: " . $conn.error . "<br>";
		}
	}

	if(mysqli_query($conn, "DESCRIBE `useraddresses`")){
		echo "useraddresses TABLE EXISTS<br>";
	} else {
		$query = "CREATE TABLE useraddresses (description VARCHAR(30), streetAddress1 VARCHAR(70), streetAddress2 VARCHAR(70), city VARCHAR(40), state VARCHAR(2), zipcode INT(5), clientid INT(10))";
		if($conn -> query($query) === TRUE){
			echo "useraddresses TABLE MADEE<br>";
		} else {
			echo "Error creating table: " . $conn.error . "<br>";
		}
	}

	if(mysqli_query($conn, "DESCRIBE `userhistory`")){
		echo "useraddresses TABLE EXISTS<br>";
	} else {
		$query = "CREATE TABLE userhistory (origin VARCHAR(90), dest VARCHAR(90), date VARCHAR(20), polyline VARCHAR(30), clientid INT(10))";
		if($conn -> query($query) === TRUE){
			echo "useraddresses TABLE MADEE<br>";
		} else {
			echo "Error creating table: " . $conn.error . "<br>";
		}
	}

	if(mysqli_query($conn, "DESCRIBE `usersettings`")){
		echo "usersettings TABLE EXISTS<br>";
	} else {
		$query = "CREATE TABLE usersettings (sendEmails BOOLEAN, clientid INT(10))";
		if($conn -> query($query) === TRUE){
			echo "usersettings TABLE MADEE<br>";
		} else {
			echo "Error creating table: " . $conn.error . "<br>";
		}
	}

	$conn->close();
?>
