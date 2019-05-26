window.onload = function() {
  console.log("DOM has loaded");
  var view = document.getElementById("view");

  var activeRoutes = Array.from(document.querySelectorAll("[route]"));
  function navigate(event) {
    let route = event.target.attributes[0].value;
    let routeInfo = myFirstRouter.routes.filter(r => r.path === route)[0];
    console.log(routeInfo);
    if (!routeInfo) {
      view.innerHTML = "No route exists with this path";
    } else {
      window.history.pushState({}, "name", routeInfo.path);
      view.innerHTML = " You have clicked the " + routeInfo.name + " route";
    }
  }

  activeRoutes.forEach(route => {
    route.addEventListener("click", navigate, false);
  });

  var Router = function(name, routes) {
    return {
      name: name,
      routes: routes
    };
  };

  var myFirstRouter = new Router("myFirstRouter", [
    { path: "/", name: "Root" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" }
  ]);

  var currentPath = window.location.pathname;

  if (currentPath === "/") {
    loadMovies();
  } else {
    var route = myFirstRouter.routes.filter(r => r.path === currentPath)[0];

    if (route) {
      view.innerHTML = "You are on the " + route ? route.name : "" + "path";
    } else {
      view.innerHTML = "404: Route not found";
    }
  }
};

function loadMovies() {
  var nowPlaying = getHttpRequest(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1"
  );

  // Cache of the template
  var template = document.getElementById("template-list-item");
  // Get the contents of the template
  var templateHtml = template.innerHTML;
  // Final HTML variable as empty string
  var listHtml = "";

  // Loop through dataObject, replace placeholder tags
  // with actual data, and generate final HTML
  for (let i = 0; i < nowPlaying.results.length; i++) {
    console.log(nowPlaying.results[i]);
    listHtml += templateHtml
      .replace(/{{id}}/g, nowPlaying.results[i]["id"])
      .replace(/{{title}}/g, nowPlaying.results[i]["title"])
      .replace(/{{city}}/g, nowPlaying.results[i]["popularity"])
      .replace(/{{state}}/g, nowPlaying.results[i]["poster_path"])
      .replace(/{{url}}/g, nowPlaying.results[i]["poster_path"]);
  }

  // Replace the HTML of #list with final HTML
  document.getElementById("list").innerHTML = listHtml;
}

function getHttpRequest(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
