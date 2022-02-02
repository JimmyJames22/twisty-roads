let origin;
let dest;
let originIn;
let destIn;

let originLog = [];
let destLog = [];

let originPredictions = [];
let destPredictions = [];

let originStr;
let destStr;
let originId;
let destId;

let routesDiv;
let menuDiv;
let routesHolderDiv;

let routeTaken = true;

let map;
let routes = [];
let lines = [];

let routeArrows = [];
let routeDivs = [];
let stepWrappers = [];

let locationNum;

let loadingPhrases = [
  "Why are there fun runs but no fun drives?",
  "Drive like the F1 driver you know you are",
  "Go somewhere you've never gone before",
  "How about a family road trip?",
  "Are we there yet?",
];

let key = "AIzaSyDrZ-lEzCYDJRXJc6RxAjcyxK_JSfQpEIw";
let header = "http://localhost:8080/";

let elevData = [];

console.log("f");

function init() {
  console.log("H");
  console.log(window.state);
  origin = document.getElementById("origin");
  dest = document.getElementById("dest");
  originIn = document.getElementById("originInput");
  destIn = document.getElementById("destInput");
  originPredictions = document.getElementsByClassName("originIn");
  destPredictions = document.getElementsByClassName("destIn");
  routesDiv = document.getElementsByClassName("routes")[0];
  menuDiv = document.getElementsByClassName("menu")[0];
  routesHolderDiv = document.getElementsByClassName("routeHolder")[0];
  routeArrows = document.getElementsByClassName("routeArrow");
  routeDivs = document.getElementsByClassName("route");
  stepWrappers = document.getElementsByClassName("stepWrapper");

  originIn.addEventListener("keyup", () => {
    autoCompleteOrig();
  });
  dest.addEventListener("keyup", (event) => {
    autoCompleteDest();
  });
  originIn.addEventListener("focusin", () => {
    focusInput(false);
  });
  destIn.addEventListener("focusin", () => {
    focusInput(true);
  });
  originIn.addEventListener("focusout", () => {
    unfocusInput(false);
  });
  destIn.addEventListener("focusout", () => {
    unfocusInput(true);
  });

  for (let i = 0; i < originPredictions.length; i++) {
    originPredictions[i].addEventListener("mousedown", () => {
      if (i == 0) {
        predictionListeners(true, null, null);
      } else {
        predictionListeners(false, false, originLog[i - 1]);
      }
    });
  }

  for (let i = 0; i < destPredictions.length; i++) {
    destPredictions[i].addEventListener("mousedown", () => {
      predictionListeners(false, true, destLog[i]);
    });
  }

  for (let i = 0; i < routeArrows.length; i++) {
    routeArrows[i].addEventListener("mousedown", () => {
      changeRouteHighlight(i);
    });
  }

  for (let i = 0; i < routeDivs.length; i++) {
    routeDivs[i].addEventListener("mouseenter", () => {
      highlightLine(i);
    });
    routeDivs[i].addEventListener("mouseleave", () => {
      blurLine(i);
    });
  }

  document.addEventListener("scroll", function () {
    let offset = window.pageYOffset;
    if (offset < window.innerHeight * 0.8) {
      document.getElementById("routingBackground").style.top = `${
        0 + offset / 3
      }px`;
      if (routeTaken) {
        document.getElementById("arrow").style.top = `calc(90% + ${
          offset * 1.5
        }px)`;
        document.getElementById("arrow").style.opacity = `calc(100% - ${
          offset / 2
        }%)`;
      }
    }
  });
}

function getJSON(url, callback) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
  })
    .done(function (data) {
      callback(null, data);
    })
    .fail(function (xhr, status, errorThrown) {
      callback(status, xhr.responseText);
    });
}

function getJSONSync(url, callback) {
  $.ajax({
    type: "GET",
    dataType: "json",
    url: url,
    async: false,
    timeout: 3000,
  })
    .done(function (data) {
      callback(null, data);
    })
    .fail(function (xhr, status, errorThrown) {
      callback(status, xhr.responseText);
    });
}

function textEllipses(el) {
  el.style.whiteSpace = "noWrap";
  el.style.overflow = "hidden";
  el.style.textOverflow = "ellipsis";
}

function centerVert(parent, child) {
  parent.style.position = "relative";
  child.style.position = "absolute";
  child.style.top = "40%";
  child.style.transform = "translateY(-50%)";
}

function autoCompleteOrig() {
  let input = originIn.value;
  console.log(input);
  let url = `${header}https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${key}`;
  getJSON(url, (err, data) => {
    if (err !== null) {
      alert(`Something went wrong ${err}`);
    } else {
      originLog = [];
      for (let j = 0; j < data.predictions.length; j++) {
        originLog.push(data.predictions[j]);
        focusInput(false);
      }
    }
  });
}

function autoCompleteDest() {
  let input = destIn.value;
  console.log(input);
  let url = `${header}https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=${key}`;
  getJSON(url, (err, data) => {
    if (err !== null) {
      alert(`Something went wrong ${err}`);
    } else {
      destLog = [];
      for (let j = 0; j < data.predictions.length; j++) {
        destLog.push(data.predictions[j]);
        focusInput(true);
      }
    }
  });
}

function focusInput(dest) {
  let log = "";
  let locations = [];
  if (dest) {
    console.log("DEST");
    locations = document.getElementsByClassName("destAuto");
    log = destLog;
  } else {
    document.getElementById("currentLocation").classList.remove("hidden");
    locations = document.getElementsByClassName("originAuto");
    log = originLog;
  }

  for (let j = 0; j < log.length; j++) {
    locations[j].classList.remove("hidden");
    locations[j].textContent = log[j].description;
  }
}

function unfocusInput(dest, ele) {
  let locations;
  if (dest) {
    locations = document.getElementsByClassName("destIn");
  } else {
    locations = document.getElementsByClassName("originIn");
  }

  for (let x = 0; x < locations.length; x++) {
    locations[x].classList.add("hidden");
  }
}

function stylePredictions(div, el, data, j, currentLocation) {
  if (currentLocation) {
    el.textContent = "Current Location";
  } else {
    el.textContent = data[j].description;
  }
  el.style.marginTop = "5px";
  el.style.marginBottom = "0px";
  el.style.paddingBottom = "0px";
  el.style.width = "calc(100% - 20px)";
  el.style.paddingLeft = "10px";
  el.style.fontSize = "15px";
  textEllipses(el);
  centerVert(div, el);
  div.style.margin = "none";
  div.style.padding = "none";
  div.style.backgroundColor = "rgba(200, 200, 200, 0.8)";
  div.style.width = "calc(100% + 3px)";
  div.style.height = "35px";
  if (!currentLocation) {
    if (div.classList.contains("originIn")) {
      div.style.gridRow = j + 3;
    } else {
      div.style.gridRow = j + 2;
    }
  }
  div.appendChild(el);
  predictionListeners(div, currentLocation);
}

function predictionListeners(currentLocation, dest, locationArr) {
  if (currentLocation) {
    if (navigator.geolocation) {
      originStr = "Current Location";
      originIn.value = originStr;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          originId = `${position.coords.latitude},${position.coords.longitude}`;
          console.log(originId);
          checkStatus();
        },
        (err) => {
          alert(err);
        }
      );
    } else {
      alert(
        "Your browser does not support location services, please enter a route manually."
      );
    }
    return;
  }
  if (dest) {
    destStr = locationArr.description;
    destIn.value = destStr;
    destId = `place_id:${locationArr.place_id}`;
    console.log(destId);
  } else {
    originStr = locationArr.description;
    originIn.value = originStr;
    originId = `place_id:${locationArr.place_id}`;
    console.log(originId);
  }
  checkStatus();
}

function checkStatus() {
  if (destStr === destIn.value && destId) {
    destIn.classList.add("done");
    if (originStr === originIn.value && originId) {
      document.getElementById("nav").disabled = false;
    }
  } else {
    destIn.classList.remove("done");
    document.getElementById("nav").disabled = true;
  }
  if (originStr === originIn.value && originId) {
    originIn.classList.add("done");
    if (destStr === destIn.value && destId) {
      document.getElementById("nav").disabled = false;
    }
  } else {
    originIn.classList.remove("done");
    document.getElementById("nav").disabled = true;
  }
}

function takeRoutingInput() {
  document.getElementById("nav").style.backgroundColor =
    "rgba(37, 173, 32, 0.767)";
  document.getElementById("nav").disabled = true;
  document.getElementById("loading").style.opacity = "1";
  url = `${header}https://maps.googleapis.com/maps/api/directions/json?origin=${originId}&destination=${destId}&alternatives=true&avoid=tolls|highways|ferries&key=${key}`;
  getJSON(url, (err, data) => {
    console.log(data);
    if (routeTaken) {
      clearMap();
      clearMenu();
      routes = [];
    }
    for (let i = 0; i < data.routes.length; i++) {
      routes.push(new route(data.routes[i]));
    }
    if (routes.length == 0) {
      alert("Route not possible, please try again");
    } else {
      routeTaken = true;
      document.getElementById("loading").style.opacity = "0";
      document.getElementById("arrow").style.opacity = "1";
      document.getElementById("body").classList.add("done");
    }
  });
}

function clearMap() {
  for (i = 0; i < lines.length; i++) {
    lines[i].setMap(null);
  }
}

function clearMenu() {
  let summaries = document.getElementsByClassName("routeSummary");
  let distances = document.getElementsByClassName("routeDistance");
  let graphs = document.getElementsByClassName("elevGraph");
  let steps = document.getElementsByClassName("steps");
  let mostFunTexts = document.getElementsByClassName("mostFunText");
  let shortestTexts = document.getElementsByClassName("shortestText");

  for (i = 0; i < routeDivs.length; i++) {
    div = routeDivs[i];
    div.classList.add("hidden");
    div.classList.remove("mostFun");
    div.classList.remove("shortest");

    mostFunTexts[i].style.opacity = "0";
    shortestTexts[i].style.opacity = "0";

    let step = steps[i];
    while (step.firstChild) {
      step.removeChild(step.firstChild);
    }

    let graph = graphs[i];
    while (graph.firstChild) {
      graph.removeChild(graph.firstChild);
    }
    let canvas = document.createElement("canvas");
    canvas.id = `graph${i}Wrapper`;
    graph.appendChild(canvas);
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 42.2495, lng: -71.0662 },
    zoom: 6,
    mapTypeId: "terrain",
  });
}

class route {
  constructor(routeData) {
    this.routeData = routeData;
    this.elevNum = 0;
    this.distNum = 0;
    this.elevCoords = [];
    this.path;
    this.rating;
    this.elevSum = 0;
    this.elevRespData = [];
    this.aveElev; //bigger better
    this.distSum = 0;
    this.aveDist; //bigger better
    this.doneElevData = false;
    this.isMostFun = false;
    this.isLongest = false;
    this.isShortest = false;
    this.steps = [];
    this.lineIndex;

    this.analyze(routeData);
  }

  analyze(data) {
    let elevQuery = [];

    for (let i = 0; i < data.legs.length; i++) {
      for (let j = 0; j < data.legs[i].steps.length; j++) {
        let path = google.maps.geometry.encoding.decodePath(
          data.legs[i].steps[j].polyline.points
        );
        this.elevCoords = this.elevCoords.concat(path);
        this.steps.push(data.legs[i].steps[j]);
        this.distance(
          data.legs[i].steps[j],
          data.legs[i].steps[j].start_location,
          data.legs[i].steps[j].end_location
        );
        this.distNum++;
      }
      console.log("STEPS");
      console.log(this.steps);
    }

    let done = false;
    let x = 0;

    while (!done) {
      let q = "";
      for (let y = 0; y < 512; y++) {
        this.elevNum++;
        if (x + y == this.elevCoords.length - 1) {
          done = true;
          break;
        }
        if (y == 0) {
          q += `${this.elevCoords[x + y].lat()},${this.elevCoords[
            x + y
          ].lng()}`;
        } else {
          q += `|${this.elevCoords[x + y].lat()},${this.elevCoords[
            x + y
          ].lng()}`;
        }
      }
      elevQuery.push(q);
      x += 512;
      if (done) {
        break;
      }
    }
    this.elevData(elevQuery);
  }

  crunch(elevResponse) {
    console.log(elevResponse);
    let elev;
    for (let x = 0; x < elevResponse.length; x++) {
      let elev = elevResponse[x].elevation;
      this.elevRespData.push(Number(elev));
      this.elevSum += elev;
    }
    this.aveElev = this.elevSum / this.elevNum;
    this.aveDist = this.distSum / this.distNum;
    console.log("elevSum " + this.elevSum);
    console.log("distSum " + this.distSum);
    console.log("distNum " + this.distNum);
    console.log("elevNum " + this.elevNum);
    console.log("aveElev " + this.aveElev);
    this.rating = (this.aveDist + this.aveElev) / 2;

    orderRoutes();
    drawRoutes();
  }

  distance(step, loc1, loc2) {
    let lat1 = loc1.lat;
    let lon1 = loc1.lng;
    let lat2 = loc2.lat;
    let lon2 = loc2.lng;

    //Code for the haversine formula sourced from https://www.htmlgoodies.com/beyond/javascript/calculate-the-distance-between-two-points-in-your-web-apps.html
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var radlon1 = (Math.PI * lon1) / 180;
    var radlon2 = (Math.PI * lon2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var distStr =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    distStr = Math.acos(distStr);
    distStr = (distStr * 180) / Math.PI;
    distStr = distStr * 60 * 1.1515;
    //End sourced code

    let distAct = step.distance.value * 0.0006213712;
    this.dist += distAct;
    this.distSum += distAct / distStr;
  }

  elevData(elevData) {
    let elevResponse = [];
    this.doneElevData = false;
    let elevProm = new Promise(function (resolve, reject) {
      for (let x = 0; x < elevData.length; x++) {
        console.log(elevData[x]);
        let url = `${header}https://maps.googleapis.com/maps/api/elevation/json?locations=${elevData[x]}&key=${key}`;
        console.log("url " + url);
        getJSONSync(url, (err, data) => {
          if (err) {
            reject(err);
          }
          console.log("HIIIIIIIIIIIII");
          console.log(data);
          elevResponse = elevResponse.concat(data.results);
          console.log(elevResponse);
          if (x == elevData.length - 1) {
            resolve(elevResponse);
          }
        });
      }
    });
    elevProm.then(
      (elevResponse) => {
        console.log("CRUNCH");
        this.crunch(elevResponse);
      },
      (err) => {
        alert(err);
      }
    );
  }
}

function orderRoutes() {
  let shortestDistance = 0;
  let shortestDistanceIndex;
  let longestDistance = 0;
  let longestDistanceIndex;
  let rating = 0;
  let ratingIndex;
  for (let i = 0; i < routes.length; i++) {
    let distance;
    if (i == 0) {
      distance = routes[i].routeData.legs[0].distance.value;
      rating = routes[i].rating;
      ratingIndex = i;
      shortestDistance = distance;
      shortestDistanceIndex = i;
      longestDistance = distance;
      longestDistanceIndex = i;
    } else {
      distance = routes[i].routeData.legs[0].distance.value;
      if (distance < shortestDistance) {
        shortestDistance = distance;
        shortestDistanceIndex = i;
        console.log("yay");
      }
      if (distance > longestDistance) {
        longestDistance = distance;
        longestDistanceIndex = i;
      }
      if (routes[i].rating > rating) {
        rating = routes[i].rating;
        ratingIndex = i;
      }
    }
    console.log("dde" + distance);
  }
  routes[shortestDistanceIndex].isShortest = true;
  routes[longestDistanceIndex].isLongest = true;
  routes[ratingIndex].isMostFun = true;
}

function drawRoutes() {
  let bounds = new google.maps.LatLngBounds();
  bounds.extend(routes[0].routeData.legs[0].start_location);
  bounds.extend(
    routes[0].routeData.legs[routes[0].routeData.legs.length - 1].end_location
  );
  map.setCenter(bounds.getCenter);
  map.fitBounds(bounds);
  for (let i = routes.length - 1; i >= 0; i--) {
    let color;
    if (routes[i].isShortest) {
      color = "#33cc33";
    }
    if (routes[i].isMostFun) {
      color = "#ff5050";
    }

    routes[i].lineColor = color;

    let line = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(
        routes[i].routeData.overview_polyline.points
      ),
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 7.0,
      strokeWeight: 4,
      zIndex: 1,
    });

    line.setMap(map);
    lines.push(line);

    routes[i].lineIndex = lines.length - 1;
  }

  let summaries = document.getElementsByClassName("routeSummary");
  let distances = document.getElementsByClassName("routeDistance");
  let durations = document.getElementsByClassName("routeDuration");
  // let indexes = document.getElementsByClassName("routeIndex");
  let steps = document.getElementsByClassName("steps");
  let mostFunTexts = document.getElementsByClassName("mostFunText");
  let shortestTexts = document.getElementsByClassName("shortestText");

  for (let i = 0; i < routes.length; i++) {
    let route = routes[i];
    let div = routeDivs[i];
    let summary = summaries[i];
    let distance = distances[i];
    let duration = durations[i];
    // let index = indexes[i];
    let step = steps[i];

    div.classList.remove("hidden");

    if (route.isMostFun) {
      div.classList.add("mostFun");
      mostFunTexts[i].style.opacity = "1";
      mostFunTexts[i].style.width = "auto";
      mostFunTexts[i].style.left = "5px";
    }
    if (route.isShortest) {
      div.classList.add("shortest");
      shortestTexts[i].style.opacity = "1";
      shortestTexts[i].style.width = "auto";
      shortestTexts[i].style.left = "5px";
    }
    summary.textContent = route.routeData.summary;
    distance.textContent = route.routeData.legs[0].distance.text;
    duration.textContent = route.routeData.legs[0].duration.text;

    let chartStr = "graph" + i + "Wrapper";

    let labels = [];

    for (let j = 0; j < route.elevRespData.length; j++) {
      labels.push(j);
    }

    let data = {
      labels: labels,
      datasets: [
        {
          label: "Elevation Data",
          data: route.elevRespData,
          fill: true,
          borderColor: "rgb(0, 170, 0)",
          tension: 0.3,
          pointRadius: 0,
        },
      ],
    };

    new Chart(chartStr, {
      type: "line",
      data: data,
      options: {
        scales: {
          yAxes: [
            {
              display: false,
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
      },
    });

    for (let j = 0; j < route.steps.length; j++) {
      let stepData = route.steps[j];
      let div = document.createElement("div");
      let img = document.createElement("img");

      switch (stepData.maneuver) {
        case "turn-slight-left":
        case "turn-sharp-left":
        case "turn-left":
        case "keep-left":
          img.src = "./media/directions-icons/turn-left.png";
          break;

        case "turn-slight-right":
        case "turn-sharp-right":
        case "turn-right":
        case "keep-right":
          img.src = "./media/directions-icons/turn-right.png";
          break;

        case "uturn-left":
          img.src = "./media/directions-icons/u-turn-left.png";
          break;

        case "uturn-right":
          img.src = "./media/directions-icons/u-turn-right.png";
          break;

        case "straight":
          img.src = "./media/directions-icons/straight.png";
          break;

        case "ramp-left":
        case "ramp-right":
        case "merge":
          img.src = "./media/directions-icons/merge.png";
          break;

        case "fork-left":
        case "fork-right":
          img.src = "./media/directions-icons/fork.png";
          break;

        case "ferry":
        case "ferry-train":
          img.src = "./media/directions-icons/ferry.png";
          break;

        case "roundabout-left":
        case "roundabout-right":
          img.src = "./media/directions-icons/roundabout.png";
          break;

        default:
          img.style.opacity = "0";
      }

      let h3 = document.createElement("h3");
      h3.innerHTML = stepData.html_instructions;

      div.appendChild(img);
      div.appendChild(h3);
      step.appendChild(div);

      styleSteps(div, img, h3);
    }
    console.log("Route " + i);
    console.log("rating: " + route.rating);
    console.log("dist: " + route.aveDist);
    console.log("elev: " + route.aveElev);
  }
}

function styleSteps(div, img, h3) {
  div.style.minHeight = "50px";
  div.style.width = "100%";
  div.style.display = "grid";
  div.style.gridTemplateColumns = "50px 1fr";

  img.style.gridColumn = "0";
  img.style.height = "40px";
  img.style.width = "40px";
  img.style.margin = "auto";
  img.style.padding = "5px";

  h3.style.fontSize = "15px";
  h3.style.marginLeft = "10px";
  h3.style.marginRight = "8px";
}

function changeMenuState() {
  console.log("changeMenuState()");
  if (menuDiv.classList.contains("menuHidden")) {
    routesDiv.classList.remove("routesHidden");
    menuDiv.classList.remove("menuHidden");
    routesHolderDiv.classList.remove("holderHidden");
  } else {
    routesDiv.classList.add("routesHidden");
    menuDiv.classList.add("menuHidden");
    routesHolderDiv.classList.add("holderHidden");
  }
}

function changeRouteHighlight(i) {
  console.log(routeArrows);
  console.log(i);
  let route = routeDivs[i];
  let stepWrapper = stepWrappers[i];
  if (route.classList.contains("routeExpanded")) {
    route.classList.remove("routeExpanded");
    stepWrapper.classList.add("stepsHidden");
  } else {
    route.classList.add("routeExpanded");
    stepWrapper.classList.remove("stepsHidden");
  }
}

function highlightLine(i) {
  if (routes[i]) {
    console.log(i);
    lines[routes[i].lineIndex].setOptions({ strokeWeight: 7, zIndex: 2 });
  }
}

function blurLine(i) {
  if (routes[i]) {
    lines[routes[i].lineIndex].setOptions({ strokeWeight: 4, zIndex: 1 });
  }
}
