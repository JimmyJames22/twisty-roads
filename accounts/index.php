<?php
    session_start();
?>

<!DOCTYPE html>
<head>
    <title>Your Account</title>
    <link rel="stylesheet" href="./accounts.css">
    <?php
        if(!isset($_SESSION["clientid"])){
            header("Location: ./login");
        }

        $clientid = $_SESSION["clientid"];

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
        
        $getUsers = "SELECT * FROM userlist INNER JOIN useraddresses ON userlist.clientid = useraddresses.clientid";
        $userResult = mysqli_query($conn, $getUsers);

        $fname;
        $lname;
        $email;
        $phone;
        $addresses = array();
        $rowCounnter = 0;
        while($row = mysqli_fetch_assoc($userResult)) {
            global $fname, $lname, $email, $phone, $addresses, $rowCounnter;

            print_r($row);
            echo("<br>");
            echo("<br>");

            $fname = $row["firstname"];
            $lname = $row["lastname"];
            $email = $row["email"];
            $phone = $row["phone"];
            $address = array("description" => $row["description"], "streetAddress1" => $row["streetAddress1"], "streetAddress2" => $row["streetAddress2"], "city" => $row["city"], "state" => $row["state"], "zipcode" => $row["zipcode"]);
            $addresses[$rowCounnter] = $address;
            $rowCounnter ++;
        }

        print_r($addresses);

        // $getPlaces = "SELECT * FROM `$clientid`";
        // $placesResult = mysqli_query($conn, $getPlaces);
        // $places = array();

        // while($row = mysqli_fetch_assoc($placesResult)){
        //     global $places;
        //     $place = array($row["name"], $row["address"]);
        //     $places = array_merge($places, $place);
        // }
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
                <h3 class="data" contenteditable="true"><?php echo $email; ?></h3>
            </div>
            <div class="info">
                <h3 class="label">Phone  </h3>
                <h3 class="data" contenteditable="true"><?php echo $phone; ?></h3>
            </div>
        </div>
        <h2>Your Places</h2>
        <div id="places" class="infoblock">
            <?php 
                $x=0;
                foreach($addresses as $address) {
            ?>
            <div class="info">
                <h3 class="label" contenteditable="true"><?php echo $address["description"]; ?></h3>
                <br>
                <h3 class="data" contenteditable="true" style="margin-left: 15px;"><?php echo $address["streetAddress1"]; ?></h3>
                <br>
                <?php
                    if(strlen($address["streetAddress2"]) > 0){
                ?>
                <h3 class="data" contenteditable="true" style="margin-left: 15px;"><?php echo $address["streetAddress2"]; ?></h3>
                <br>
                <?php
                    }
                ?>
                <h3 class="data" style="margin-right: 0; margin-left: 15px;" contenteditable="true"><?php echo $address["city"]; ?></h3>
                <h3 class="data" style="margin-right: 0; margin-left: -5px;">, </h3>
                <h3 class="data" style="margin-right: 0; margin-left: 0;" contenteditable="true"><?php echo $address["state"]; ?></h3>
                <br>
                <br>
            </div>
            <?php
                    $x++;
                }
            ?>
        </div>
    </div>
    <?php mysqli_close($conn); ?>
</body>