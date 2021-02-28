<?php
    $email = htmlspecialchars($_GET["email"]);
    $password = htmlspecialchars($_GET["password"]);

    $servername = "localhost:3306";
	$username = "root";

    // Create connection
	$conn = new mysqli($servername, $username);
	// when there is a password, do $conn = mysqli_connect($servername, $username, $password);	$conn = mysqli_connect($servername, $username);


	// Check connection
	if (!$conn) {
	  die("Connection failed: " . mysqli_connect_error()) . "<br>";
	}
	echo "Connected successfully<br>";

    mysqli_select_db($conn, 'users');
    
    $getUsers = "SELECT * FROM userlist WHERE email='$email'";
    $result = mysqli_query($conn, $getUsers);

    if(mysqli_num_rows($result) > 0){
        while($row = mysqli_fetch_assoc($result)) {
            echo $row["email"] . "<br>";
            echo $row["password"] . "<br>";
            if($row["password"] === $password){
                $params = array(
                    'clientid' => $row["clientid"]
                );
                $data = http_build_query($params);
                header('Location: ../?' . $data);
                break;
            } else {
                $params = array {
                    'email' => $row["email"],
                    'invalidpass' => true
                }
                $data = http_build_query($params);
                header("Location: ./?email=$row['email']&invalidpass=true");
            }
        }
    } else {
        header("Location: ./?invalidlogin=true");
    }

    mysqli_close($conn);
?>