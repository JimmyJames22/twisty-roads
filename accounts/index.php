<?php
    session_start();
?>

<!DOCTYPE html>
<head>
    <title>Your Account</title>
    <link rel="stylesheet" href="./accounts.css">
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="./accounts.js"></script>
    <?php
        if(!isset($_SESSION["clientid"])){
            header("Location: ./login");
        }

        $clientid = $_SESSION["clientid"];

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

        mysqli_select_db($conn, 'users');
        
        $getUsers = "SELECT * FROM userlist INNER JOIN useraddresses ON userlist.clientid = useraddresses.clientid";
        $userResult = mysqli_query($conn, $getUsers);

        $fname;
        $lname;
        $email;
        $phone;
        $addresses = array();
        $addressesCopy = array();
        $rowCounnter = 0;

        while($row = mysqli_fetch_assoc($userResult)) {
            global $fname, $lname, $email, $phone, $addresses, $rowCounnter;
            $fname = $row["firstname"];
            $lname = $row["lastname"];
            $email = $row["email"];
            $phone = $row["phone"];
            $address = array("description" => $row["description"], "streetAddress1" => $row["streetAddress1"], "streetAddress2" => $row["streetAddress2"], "city" => $row["city"], "state" => $row["state"], "zipcode" => $row["zipcode"]);
            $addresses[$rowCounnter] = $address;
            $rowCounnter ++;
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
                <h3 class="data" id="fname"><?php echo $fname;?></h3>
                <h3 class="data" id="lname"><?php echo $lname;?></h3>
            </div>
            <div class="info">
                <h3 class="label">Email  </h3>
                <h3 class="data" id="email"><?php echo $email; ?></h3>
            </div>
            <div class="info">
                <h3 class="label">Phone  </h3>
                <h3 class="data" id="phone"><?php echo $phone; ?></h3>
            </div>
        </div>
        <h2>Your Places</h2>
        <div id="places" class="infoblock">
            <?php 
                $x=0;
                for($x=0; $x < count($addresses); $x++) {
            ?>
            <div class="info">
                <h3 class="label" id="description"><?php echo $addresses[$x]["description"]; ?></h3>
                <br>
                <h3 class="data" id="streetAddress1" style="margin-left: 15px;"><?php echo $addresses[$x]["streetAddress1"]; ?></h3>
                <br>
                <?php
                    if(strlen($addresses[$x]["streetAddress2"]) > 0){
                ?>
                <h3 class="data" id="streetAddress2" style="margin-left: 15px;"><?php echo $addresses[$x]["streetAddress2"]; ?></h3>
                <br>
                <?php
                    }
                ?>
                
                <h3 class="data" id="city" style="margin-right: 0; margin-left: 15px;"><?php echo $addresses[$x]["city"]; ?></h3>
                <h3 class="data" style="margin-right: 0; margin-left: -5px;">, </h3>
                <h3 class="data" id="state" style="margin-right: 0; margin-left: 0;"><?php echo $addresses[$x]["state"]; ?></h3>
                <br>
                <br>
            </div>
            <?php
                }
            ?>
        </div>
    </div>
    
    <?php 
    
    mysqli_close($conn); 
    
    function updateAddress($key) {
        
    }

    ?>
</body>