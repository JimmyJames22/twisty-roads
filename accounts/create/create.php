<?php
	session_start();

    $firstname = $_GET["fname"];
    $lastname = $_GET["lname"];
    $email = $_GET["email"];
    $phone = $_GET["phone"];
    $password = $_GET["password"];
	$streetAddress1 = $_GET["streetAddress1"];
	$streetAddress2 = $_GET["streetAddress2"];
	$city = $_GET["city"];
	$state = $_GET["state"];
	$zipcode = $_GET["zipcode"];
	
	$clientid;
  echo($firstname);
	echo("<br>");
	echo($lastname);
	echo("<br>");
  echo($email);
	echo("<br>");
	echo($phone);
	echo("<br>");
	echo($password);
	echo("<br>");
	echo($streetAddress1);
	echo("<br>");
	echo($streetAddress2);
	echo("<br>");
	echo($city);
	echo("<br>");
	echo($state);
	echo("<br>");
	echo($zipcode);

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

	mysqli_select_db($conn, 'users');

	//check if table exists
	// $test = mysqli_query($conn, 'select i from `userlist`');
	if(mysqli_query($conn, "DESCRIBE `userlist`")){
		echo "userlist TABLE EXISTS<br>";
	} else {
		echo "userlist TABLE GONE OH NOOOO<br>";
    }
    
    $makeUser = "INSERT INTO userlist (firstname, lastname, email, phone) VALUES ('$firstname', '$lastname', '$email', '$phone')";

    if(mysqli_query($conn, $makeUser)) {
        echo "User added <br>";
    } else {
        echo "FAILED TO ADD USER in USERLIST <br>" . mysqli_error($conn);
	}

	$getId = "SELECT * FROM userlist WHERE email='$email'";
    $result = mysqli_query($conn, $getId);

    while($row = mysqli_fetch_assoc($result)) {
		global $clientid;
        $clientid = $row["clientid"];
    }
	
	if(mysqli_query($conn, "DESCRIBE `userlogin`")){
		echo "userlogin TABLE EXISTS<br>";
	} else {
		echo "userlogin TABLE GONE OH NOOOO<br>";
    }
	
	$makeLogin = "INSERT INTO userlogin (email, password, clientid) VALUES ('$email', '$password', '$clientid')";

	if(mysqli_query($conn, $makeLogin)) {
        echo "Login added <br>";
    } else {
        echo "FAILED TO ADD LOGIN <br>" . mysqli_error($conn);
	}

	if(mysqli_query($conn, "DESCRIBE `useraddresses`")){
		echo "useraddresses TABLE EXISTS<br>";
	} else {
		echo "useraddresses TABLE GONE OH NOOOO<br>";
    }

	$makeAddress = "INSERT INTO useraddresses (description, streetAddress1, streetAddress2, city, state, zipcode, clientid) VALUES ('Home', '$streetAddress1', '$streetAddress2', '$city', '$state', '$zipcode', '$clientid')";

	if(mysqli_query($conn, $makeAddress)){
		echo "Address added <br>";
    } else {
        echo "FAILED TO ADD ADDRESS <br>" . mysqli_error($conn);
	}

	$_SESSION["clientid"] = $clientid;

	$conn->close();

?>