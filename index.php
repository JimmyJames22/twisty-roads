<?php
  session_start();
?>

<!DOCTYPE html>
<html>
  <head>
    <title>Twisty Rodes</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
    <link rel="stylesheet" href="styles/index.css"></link>
    <link rel="icon" type="image/png" href="./media/TR.png"/>
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
          <div id="currentLocation" class="originIn location hidden ellipsis">Curent Location</div>
          <div id="0" class="originIn location originAuto hidden ellipsis"></div>
          <div id="1" class="originIn location originAuto hidden ellipsis"></div>
          <div id="2" class="originIn location originAuto hidden ellipsis"></div>
          <div id="3" class="originIn location originAuto hidden ellipsis"></div>
          <div id="4" class="originIn location originAuto hidden ellipsis"></div>
        </span>
        <span class="routingIn" id="dest">
          <input type="text" class="routeInput ellipsis" id="destInput" style="width:100%;" placeholder="Destination" onkeypress="autoCompleteDest()"/>
          <div id="0" class="destIn location destAuto hidden ellipsis"></div>
          <div id="1" class="destIn location destAuto hidden ellipsis"></div>
          <div id="2" class="destIn location destAuto hidden ellipsis"></div>
          <div id="3" class="destIn location destAuto hidden ellipsis"></div>
          <div id="4" class="destIn location destAuto hidden ellipsis"></div>
        </span>
        <button class="routingIn" id="nav" onclick="takeRoutingInput()" disabled>Take me!</button>
      </div>
    </div>
    <div class="routes">
      <div class="menu">
        <div class="routeHolder">
          <div class="route hidden">
            <div class="quickRouteInfo">
              <h1 class="routeSummary ellipsis"></h1>
              <span class="routeData">
                <h3 class="routeDistance"></h3>
                <h3> | </h3>
                <h3 class="routeDuration"></h3>
              </span>
            </div>
            <div class="elevWrapper">
              <h3>Elevation Graph</h3>
              <div class="elevGraph">
                <canvas id="graph0Wrapper"></canvas>
              </div>
            </div>
            <div class="stepWrapper stepsHidden">
              <h3>Route Steps</h3>
              <div class="steps"></div>
            </div>
            <img class="routeArrow" src="./media/black-arrow-png-41944.png" draggable="false">
          </div>
          <div class="route hidden">
            <div class="quickRouteInfo">
              <h1 class="routeSummary ellipsis"></h1>
              <span class="routeData">
                <h3 class="routeDistance"></h3>
                <h3> | </h3>
                <h3 class="routeDuration"></h3>
              </span>
            </div>
            <div class="elevWrapper">
              <h3>Elevation Graph</h3>
              <div class="elevGraph">
                <canvas id="graph1Wrapper"></canvas>
              </div>
            </div>
            <div class="stepWrapper stepsHidden">
              <h3>Route Steps</h3>
              <div class="steps"></div>
            </div>
            <img class="routeArrow" src="./media/black-arrow-png-41944.png" draggable="false">
          </div>
          <div class="route hidden">
            <div class="quickRouteInfo">
              <h1 class="routeSummary ellipsis"></h1>
              <span class="routeData">
                <h3 class="routeDistance"></h3>
                <h3> | </h3>
                <h3 class="routeDuration"></h3>
              </span>
            </div>
            <div class="elevWrapper">
              <h3>Elevation Graph</h3>
              <div class="elevGraph">
                <canvas id="graph2Wrapper"></canvas>
              </div>
            </div>
            <div class="stepWrapper stepsHidden">
              <h3>Route Steps</h3>
              <div class="steps"></div>
            </div>
            <img class="routeArrow" src="./media/black-arrow-png-41944.png" draggable="false">
          </div>
        </div>
        <div id="menuHider">
          <img  src="./media/routes.png" onclick="changeMenuState()" draggable="false">
        </div>
      </div>
      <div id="map"></div>
        <script defer
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDrZ-lEzCYDJRXJc6RxAjcyxK_JSfQpEIw&libraries=geometry&callback=initMap">
        </script>  
      </div>
    </div>
  </body>
</html>
