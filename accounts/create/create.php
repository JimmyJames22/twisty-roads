<?php
    $firstname = htmlspecialchars($_GET["fname"]);
    $lastname = htmlspecialchars($_GET["lname"]);
    $email = htmlspecialchars($_GET["email"]);
    $phone = htmlspecialchars($_GET["phone"]);
    $password = htmlspecialchars($_GET["password"]);
    $homeAddress = htmlspecialchars($_GET["streetAddress"]) . " " . htmlspecialchars($_GET["city"]) . ", " . htmlspecialchars($_GET["state"]) . " " . htmlspecialchars($_GET["zipcode"]);
    echo($homeAddress);

    $servername = "localhost:3306";
	$username = "root";
	//$servpassword = "your_password";

	// Create connection
	$conn = new mysqli($servername, $username);
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
	if(mysqli_query($conn, "DESCRIBE `userlist`" )){
		echo "TABLE EXISTS<br>";
	} else {
		$query = "CREATE TABLE userlist (firstname VARCHAR(30), lastname VARCHAR(30), email VARCHAR(70), phone VARCHAR(10), homeAddress VARCHAR(70), workAddress VARCHAR(70), clientid INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY)";
		if($conn -> query($query) === TRUE){
			echo "TABLE MADEE<br>";
		} else {
			echo "Error creating table: " . $conn.error . "<br>";
		}
    }
    
    $makeUser = "INSERT INTO userlist (firstname, lastname, email, phone, homeAddress) VALUES ('$firstname', '$lastname', '$email', '$phone', '$homeAddress')";

    if(mysqli_query($conn, $makeUser)) {
        echo "User added";
    } else {
        echo "FAILED TO ADD USER <br>" . mysqli_error($conn);
    }

	$conn->close();
	header('Location: ../accountMade.html');
?>