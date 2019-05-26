window.onload = function() {
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
    { path: "/search", name: "Search" }
  ]);

  var currentPath = window.location.pathname;

  if (currentPath === "/") {
    loadMovies(1);
  } else {
    var route = myFirstRouter.routes.filter(r => r.path === currentPath)[0];

    if (route) {
      view.innerHTML = "You are on the " + route ? route.name : "" + "path";
    } else {
      view.innerHTML = "404: Route not found";
    }
  }
};

function loadMovies(page) {
  let nowPlaying = getHttpRequest(
    "https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=" +
      page
  );
  let genres = getHttpRequest(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1"
  );

  // Cache of the template
  let template = document.getElementById("template-list-item");
  // Get the contents of the template
  let templateHtml = template.innerHTML;
  // Final HTML variable as empty string
  let listHtml = "";

  // Loop through dataObject, replace placeholder tags
  // with actual data, and generate final HTML
  for (let i = 0; i < nowPlaying.results.length; i++) {
    let genre_ids = nowPlaying.results[i].genre_ids;
    let movieGenre = "";
    if (genre_ids.length > 0) {
      for (let j = 0; j < genre_ids.length; j++) {
        movieGenre +=
          genres.genres.filter(r => r.id === genre_ids[j])[0].name + " ";
      }
    }

    listHtml += templateHtml
      .replace(/{{id}}/g, nowPlaying.results[i]["id"])
      .replace(/{{title}}/g, nowPlaying.results[i]["title"])
      .replace(/{{genres}}/g, movieGenre)
      .replace(/{{vote_average}}/g, nowPlaying.results[i]["vote_average"])
      .replace(/{{overview}}/g, nowPlaying.results[i]["overview"])
      .replace(/{{url}}/g, nowPlaying.results[i]["poster_path"]);
  }

  // Replace the HTML of #list with final HTML
  let lst = document.getElementById("ul-list");
  lst.innerHTML += listHtml;
}

function getHttpRequest(theUrl) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false); // false for synchronous request
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}
var count = 1;

function isVisible(elem) {
  let coords = document.documentElement.getBoundingClientRect();

  let windowHeight = document.documentElement.clientHeight;

  // top elem edge is visible OR bottom elem edge is visible
  let topVisible = coords.top > 0 && coords.top < windowHeight;
  let bottomVisible = coords.bottom <= windowHeight && coords.bottom > 0;
  if (bottomVisible) {
    console.log(++count);
    loadMovies(count);
  }
  return topVisible || bottomVisible;
}

window.onscroll = isVisible;
