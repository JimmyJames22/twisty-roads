<?php
  session_start();
?>

<!DOCTYPE html>
<html>
  <head>
    <title>Twisty Rodes</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" href="styles/index.css"></link>
    <script src="scripts/routes.js" type="text/javascript"></script>
    <?php
      $clientid;
    ?>
    <div id="navbar">
      <div class="account">
        Account
        <ul class="dropdown-menu dropdown dropdown--animated">
          <?php if(isset($_SESSION["clientid"])){
            global $clientid;
            $clientid = $_SESSION["clientid"];
          ?>
            <li><a href="./accounts">Account Info</a></li>
            <li><a href="./logout.php">Sign Out</a></li>
          <?php } else { ?>
            <li><a href="./accounts/login">Sign In</a></li>
            <li><a href="./accounts/create">Create Account</a></li>
          <?php } ?>
        </ul>
      </div>
    </div>
  </head>
  <body id="body" onload="init()">
    <div id="routingIn">
      <img src="./media/TwistyRoad.jpg" id="routingBackground">
      <img src="./media/white-arrow-png-41944.png" id="arrow">
      <div class="taking" id="loading">
        <img src="./media/Loading.gif">
        <h4>Routing...</h4>
      </div>
      <div id="container">
        <div id="title">
          <h1>Twisty Roads</h1>
          <h3>Because driving should be fun.</h3>
        </div>
        <span class="routingIn" id="origin">
          <input type="text" class="routeInput ellipsis" id="originInput" style="width:100%;" placeholder="Origin" onkeypress="autoCompleteOrig()"/>
        </span>
        <span class="routingIn" id="dest">
          <input type="text" class="routeInput ellipsis" id="destInput" style="width:100%;" placeholder="Destination" onkeypress="autoCompleteDest()"/>
        </span>
        <button class="routingIn" id="nav" onclick="takeRoutingInput()" disabled>Take me!</button>
      </div>
    </div>
    <div id="routes" class="routesHidden">
      <div id="menu" class="routesHidden">
        <div id="routeHolder"></div>
      </div>
      <div id="menuHider">
        <h3 id="Route">Route</h3>
        <img  src="./media/routes.png" onclick="changeMenuState()" draggable="false">
        <h3 id="Menu">Menu</h3>
      </div>
      <div id="map"></div>
      <script defer
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDrZ-lEzCYDJRXJc6RxAjcyxK_JSfQpEIw&libraries=geometry&callback=initMap">
      </script>  
    </div>

  </body>
</html>
