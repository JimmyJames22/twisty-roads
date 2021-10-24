let origin;
let dest;
let originIn;
let destIn;

let originLog = [];
let destLog = [];

let originStr;
let destStr;
let originId;
let destId;

let routeTaken = false;

let map;
let routes = [];
let lines = [];

let locationNum;

let loadingPhrases = [
  "Why are there fun runs but no fun drives?",
  "Drive like the F1 driver you know you are (at the speed limit of course)",
  "Go somewhere you've never gone before",
  "How about a family road trip?",
  "Are we there yet?",
];

let key = "AIzaSyDrZ-lEzCYDJRXJc6RxAjcyxK_JSfQpEIw";
let header = "http://24.60.153.154:8080/";

let elevData = [];

console.log("f");

function init() {
  console.log("H");
  console.log(window.state);
  origin = document.getElementById("origin");
  dest = document.getElementById("dest");
  originIn = document.getElementById("originInput");
  destIn = document.getElementById("destInput");
  origin.addEventListener("keyup", () => {
    autoCompleteOrig();
  });
  dest.addEventListener("keyup", (event) => {
    autoCompleteDest();
  });
  origin.addEventListener("focusin", () => {
    focusInput(false, origin);
  });
  dest.addEventListener("focusin", () => {
    focusInput(true, dest);
  });
  origin.addEventListener("focusout", () => {
    unfocusInput(origin);
  });
  dest.addEventListener("focusout", () => {
    unfocusInput(dest);
  });
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
      let counter = 0;
      for (let j = 0; j < data.predictions.length; j++) {
        originLog.push(data.predictions[j]);
        if (document.getElementsByClassName("originIn")[j + 1]) {
          document.getElementsByClassName("originInText")[j + 1].textContent =
            data.predictions[j].description;
        } else {
          let div = document.createElement("div");
          div.id = j;
          div.classList.add("originIn");
          let el = document.createElement("h4");
          el.id = j;
          el.classList.add("autoComplete", "originInText");
          stylePredictions(div, el, data.predictions, j, false);
          document.getElementById("origin").appendChild(div);
        }
        counter++;
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
        if (document.getElementsByClassName("destIn")[j]) {
          document.getElementsByClassName("destInText")[j].textContent =
            data.predictions[j].description;
        } else {
          let div = document.createElement("div");
          div.id = j;
          div.classList.add("destIn");
          let el = document.createElement("h4");
          el.id = j;
          el.classList.add("autoComplete", "destInText");
          stylePredictions(div, el, data.predictions, j, false);
          document.getElementById("dest").appendChild(div);
        }
      }
    }
  });
}

function focusInput(dest, ele) {
  let log;
  if (dest) {
    log = destLog;
  } else {
    log = originLog;
    let div = document.createElement("div");
    div.id = "location";
    div.classList.add("originIn");
    div.classList.add("location");
    let el = document.createElement("h4");
    el.id = "locationText";
    el.classList.add("autoComplete", "originInText");
    stylePredictions(div, el, null, null, true);
    div.style.gridRow = 2;
    document.getElementById("origin").appendChild(div);
  }
  for (let j = 0; j < log.length; j++) {
    let div = document.createElement("div");
    div.id = j;
    let el = document.createElement("h4");
    el.id = j;
    if (dest) {
      el.classList.add("autoComplete", "destInText");
      div.classList.add("destIn");
    } else {
      el.classList.add("autoComplete", "originInText");
      div.classList.add("originIn");
    }
    stylePredictions(div, el, log, j, false);
    ele.appendChild(div);
    predictionListeners(div, el);
  }
}

function unfocusInput(ele) {
  while (ele.childNodes[2]) {
    ele.removeChild(ele.childNodes[2]);
  }
  checkStatus();
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

function predictionListeners(div, currentLocation) {
  div.style.transitionDuration = "100ms";
  div.addEventListener("mouseover", () => {
    div.style.backgroundColor = "rgba(255, 100, 100, 0.65)";
  });
  div.addEventListener("mouseout", () => {
    div.style.backgroundColor = "rgba(200, 200, 200, 0.8)";
  });
  div.addEventListener("mousedown", () => {
    console.log("SUCCESS!!");
    if (div.classList.contains("destIn")) {
      console.log("dest");
      destStr = destLog[div.id].description;
      destIn.value = destStr;
      destId = `place_id:${destLog[div.id].place_id}`;
      console.log(destId);
    } else if (div.classList.contains("originIn")) {
      console.log("orig");
      if (currentLocation) {
        if (navigator.geolocation) {
          originStr = "Current Location";
          originIn.value = originStr;
          navigator.geolocation.getCurrentPosition(
            (position) => {
              let lat = position.coords.latitude;
              let lng = position.coords.longitude;
              originId = `${lat},${lng}`;
              console.log(originId);
              checkStatus();
            },
            (err) => {
              alert(err);
            }
          );
        } else {
          alert("browser does not support location services");
        }
      } else {
        originStr = originLog[div.id].description;
        originIn.value = originStr;
        originId = `place_id:${originLog[div.id].place_id}`;
        console.log(originId);
      }
    }
  });
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
    orderRoutes();
    drawRoutes();
  });
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
    this.distNum;
    this.elevCoords = [];
    this.path;
    this.rating;
    this.elevSum = 0;
    this.aveElev; //bigger better
    this.distSum = 0;
    this.aveDist; //bigger better
    this.doneElevData = false;
    this.analyze(routeData);
    this.isMostFun = false;
    this.isLongest = false;
    this.isShortest = false;
  }

  analyze(data) {
    let elevQuery = [];

    for (let i = 0; i < data.legs.length; i++) {
      for (let j = 0; j < data.legs[i].steps.length; j++) {
        let path = google.maps.geometry.encoding.decodePath(
          data.legs[i].steps[j].polyline.points
        );
        this.elevCoords = this.elevCoords.concat(path);
        this.distance(
          data.legs[i].steps[j],
          data.legs[i].steps[j].start_location,
          data.legs[i].steps[j].end_location
        );
        this.distNum++;
      }
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

    console.log("HELLOOOOOO");

    this.elevData(elevQuery);
  }

  crunch(elevResponse) {
    console.log(elevResponse);
    for (let x = 0; x < elevResponse.length; x++) {
      this.elevSum += elevResponse[x].elevation;
    }
    this.aveElev = this.elevSum / this.elevNum;
    this.aveDist = this.distSum / this.distNum;
    console.log("elevSum " + this.elevSum);
    console.log("distSum " + this.distSum);
    console.log("num " + this.elevNum);
    console.log("aveElev " + this.aveElev);
    this.rating = this.aveDist + this.aveElev / 2;
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
        getJSON(url, (err, data) => {
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
    let line = new google.maps.Polyline({
      path: google.maps.geometry.encoding.decodePath(
        routes[i].routeData.overview_polyline.points
      ),
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 7.0,
      strokeWeight: 4,
    });
    line.setMap(map);
    lines.push(line);
  }
  for (let i = 0; i < routes.length; i++) {
    let div = document.createElement("div");
    div.id = i;
    div.classList.add("route");
    if (routes[i].isMostFun) {
      div.style.borderWidth = "3px";
      div.style.borderColor = "red";
    }
    let h3 = document.createElement("h3");
    h3.classList.add("routeName");
    h3.textContent = `Route ${i + 1}`;
    h4 = [];
    let dist = document.createElement("h4");
    console.log(routes[i]);
    dist.textContent = routes[i].routeData.legs[0].distance.text;
    let dur = document.createElement("h4");
    dur.textContent = routes[i].routeData.legs[0].duration.text;
    styleMenuElements(div, h3, dist, dur, i);
    div.appendChild(h3);
    div.appendChild(dist);
    div.appendChild(dur);
    if (routes[i].isMostFun) {
      let fun = document.createElement("h4");
      fun.style.color = "rgb(255, 48, 48)";
      fun.style.marginLeft = "15px";
      fun.style.marginTop = "15px";
      fun.style.marginBottom = "0px";
      fun.textContent = "Most fun Route";
      div.appendChild(fun);
    }
    if (routes[i].isShortest) {
      let short = document.createElement("h4");
      short.style.color = "rgba(37, 173, 32, 1)";
      short.style.marginLeft = "15px";
      if (routes[i].isMostFun) {
        short.style.marginTop = "5px";
      } else {
        short.style.marginTop = "15px";
      }
      short.textContent = "Shortest Route";
      div.appendChild(short);
    }
    document.getElementById("routeHolder").appendChild(div);
  }
}

function styleMenuElements(div, h3, h4, h4_2, i) {
  div.style.height = "62px";
  div.style.margin = "5%";
  div.style.marginBottom = "10px";
  div.style.marginTop = "10px";
  div.style.width = "90%";
  div.style.backgroundColor = "rgb(225, 225, 225)";
  div.style.borderRadius = "5px";
  div.style.overflow = "hidden";
  h3.style.position = "relative";
  h3.style.left = "15px";
  h3.style.top = "-5px";
  h3.style.marginBottom = "5px";
  h3.style.fontSize = "25px";
  h4.style.fontSize = "20px";
  h4.style.marginLeft = "15px";
  h4.style.marginTop = "0px";
  h4.style.marginBottom = "7px";
  h4_2.style.fontSize = "20px";
  h4_2.style.marginLeft = "15px";
  h4_2.style.marginTop = "0px";
  h4_2.style.marginBottom = "0px";
  addRouteListeners(div, h3, h4, h4_2, i);
}

function changeMenuState() {
  if (document.getElementById("routes").classList.contains("routesHidden")) {
    document.getElementById("routes").classList.remove("routesHidden");
    document.getElementById("routes").classList.add("routesShown");
    document.getElementById("menu").classList.remove("routesHidden");
    document.getElementById("menu").classList.add("routesShown");
  } else {
    document.getElementById("routes").classList.add("routesHidden");
    document.getElementById("routes").classList.remove("routesShown");
    document.getElementById("menu").classList.add("routesHidden");
    document.getElementById("menu").classList.remove("routesShown");
  }
}

function addRouteListeners(div, h3, h4, h4_2, i) {
  div.addEventListener("mouseover", () => {
    div.style.transition = ".5s";
    if (routes[i].isShortest && routes[i].isMostFun) {
      div.style.height = "185px";
    } else if (routes[i].isShortest || routes[i].isMostFun) {
      div.style.height = "153px";
    } else {
      div.style.height = "130px";
    }
  });
  div.addEventListener("mouseout", () => {
    div.style.transition = ".5s";
    div.style.height = "62px";
  });
}
