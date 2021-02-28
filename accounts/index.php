<!DOCTYPE html>
<head>
    <title>Your Account</title>
    <link rel="stylesheet" href="./accounts.css">
    <?php
        $clientid = $_GET["clientid"];
        if(!$clientid) {
            header("Location: ./login");
        }

        $servername = "localhost:3306";
        $username = "root";

        // Create connection
        $conn = new mysqli($servername, $username);
        // when there is a password, do $conn = mysqli_connect($servername, $username, $password);	$conn = mysqli_connect($servername, $username);

        // Check connection
        if (!$conn) {
            die("Connection failed: " . mysqli_connect_error()) . "<br>";
        }

        mysqli_select_db($conn, 'users');
        
        $getUsers = "SELECT * FROM userlist WHERE clientid='$clientid'";
        $userResult = mysqli_query($conn, $getUsers);

        $fname;
        $lname;
        $email;
        $phone;

        while($row = mysqli_fetch_assoc($userResult)) {
            global $fname, $lname, $email, $phone, $homeAddress, $workAddress;
            $fname = $row["firstname"];
            $lname = $row["lastname"];
            $email = $row["email"];
            $phone = $row["phone"];
        }

        mysqli_select_db($conn, 'addresses');

        $getPlaces = "SELECT * FROM `$clientid`";
        $placesResult = mysqli_query($conn, $getPlaces);
        $places = array();

        while($row = mysqli_fetch_assoc($placesResult)){
            global $places;
            $place = array($row["name"], $row["address"]);
            $places = array_merge($places, $place);
        }
    ?>
</head>
<body>
    <div id="color">
        <h1><i>Hi, <?php echo $fname; ?></i></h1><br>
        <a href="../?clientid=<?php echo $clientid; ?>"><img src="../../media/TR.png" id="tr"></a>
    </div>
    <div id="container">
        <h2>Your Info</h2>
        <div id="userinfo" class="infoblock">
            <div class="info">
                <h3 class="label">Name  </h3>
                <h3 class="data" contenteditable="true"><?php echo $fname;?></h3>
                <h3 class="data" id="lname" contenteditable="true"><?php echo $lname;?></h3>
            </div>
            <div class="info">
                <h3 class="label">Email  </h3>
                <h3 class="data" contenteditable="true"><?php echo $email; ?></h4>
            </div>
            <div class="info">
                <h3 class="label">Phone  </h3>
                <h3 class="data"><?php echo $phone; ?></h4>
            </div>
        </div>
        <h2>Your Places</h2>
        <div id="places" class="infoblock">
            <?php 
                $x=0;
                while($x < (count($places)-1)/2){
                    global $x;
            ?>
            <div class="info">
                <h3 class="label"><?php echo $places[2*$x]; ?></h3>
                <h3 class="data"><?php echo $places[2*$x+1]; ?></h4>
            </div>
            <?php
                    $x++;
                }
            ?>
        </div>
    </div>
    <?php mysqli_close($conn); ?>
</body>