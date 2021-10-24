<?php
    session_start();

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
    
    $getUsers = "SELECT * FROM userlist INNER JOIN useraddresses ON userlist.clientid = useraddresses.clientid INNER JOIN userlogin ON userlist.clientid = userlogin.clientid";
    $userResult = mysqli_query($conn, $getUsers);

    $fname;
    $lname;
    $email;
    $password;
    $phone;
    $addresses = array();
    $addressesCopy = array();
    $rowCounnter = 0;

    while($row = mysqli_fetch_assoc($userResult)) {
        global $fname, $lname, $email, $password, $phone, $addresses, $rowCounnter;
        $fname = $row["firstname"];
        $lname = $row["lastname"];
        $email = $row["email"];
        $password = $row["password"];
        $phone = $row["phone"];
        $address = array("description" => $row["description"], "streetAddress1" => $row["streetAddress1"], "streetAddress2" => $row["streetAddress2"], "city" => $row["city"], "state" => $row["state"], "zipcode" => $row["zipcode"]);
        $addresses[$rowCounnter] = $address;
        $rowCounnter ++;
    }
?>

<!DOCTYPE html>
    <head>
        <link rel="stylesheet" href="./edit.css">
    </head>
    <body>
    <div id="color">
        <h1><i>Update Yourself</i></h1><br>
        <a href="../../?clientid=<?php echo $clientid; ?>"><img src="../../../media/TR.png" id="tr"></a>
    </div>
    <div id="container">
        <form action="edit.php">
            <h2>Our Records</h2>
            <label for="fname">First Name</label>
            <input type="text" name="fname" value="<?php echo $fname;?>"><br>
            <label for="lname">Last Name</label>
            <input type="text" name="lname" value="<?php echo $lname;?>"><br>
            <label for="email">Email</label>
            <input type="text" name="email" value="<?php echo $email;?>"><br>
            <label for="phone">Phone</label>
            <input type="text" name="phone" value="<?php echo $phone;?>"><br>
            <label for="password">Password</label>
            <input type="text" name="password" value="<?php echo $password;?>"><br>
            <h2>Your Places</h2>
            <?php
                for($x=0; $x<count($addresses); $x++){
            ?>
            <h3><?php echo $addresses[$x]['description'];?></h3><br>
            <input type="text" class="address" name="streetAddress1" id="streetAddress1" placeholder="Address 1" size="34" value="<?php echo $addresses[$x]['streetAddress1']?>"><br>
            <input type="text" class="address" name="streetAddress2" id="streetAddress2" placeholder="Address 2" size="34" value="<?php echo $addresses[$x]['streetAddress2']?>"><br>
            <input type="text" class="address" name="city" id="city" placeholder="City" size="15" value="<?php echo $addresses[$x]['city']?>">
            <input list="states" class="address" name="state" id="state" placeholder="State" maxlength="2" size="5" value="<?php echo $addresses[$x]['state']?>"><br>
            <datalist id="states">
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="DC">District Of Columbia</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
            </datalist>
            <input type="text" class="address" name="zipcode" id="zipcode" placeholder="Zipcode" size="7" value="<?php echo $addresses[$x]['zipcode']?>"><br>
            <br>
            <?php
                }
            ?>
            <input id="submit" type="submit" value="Update!">
        </form>
    </div>
</body>