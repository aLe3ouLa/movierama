window.onload = function() {
  var view = document.getElementById("view");
  var theaters = document.getElementById("theaters");
  var search = document.getElementById("search");
  var currentPath = window.location.pathname;
  var activeRoutes = Array.from(document.querySelectorAll("[route]"));

  function navigate(event) {
    let route = event.target.attributes[0].value;
    let routeInfo = myFirstRouter.routes.filter(r => r.path === route)[0];

    if (routeInfo) {
      window.history.pushState({}, "name", routeInfo.path);
      currentPath = window.location.pathname;
      if (currentPath === "/") {
        getMovies("movie/now_playing", "genre/movie/list", 1);
        theaters.style.display = "block";
        search.style.display = "none";
      } else {
        var navigatedRoute = myFirstRouter.routes.filter(
          r => r.path === currentPath
        )[0];
        if (navigatedRoute) {
          theaters.style.display = "none";
          search.style.display = "block";
        } else {
            view.innerHTML = "404: Route not found";
        }
      }
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

  if (currentPath === "/") {
    getMovies("movie/now_playing", "genre/movie/list", 1);
    theaters.style.display = "block";
    search.style.display = "none";
  } else {
    var route = myFirstRouter.routes.filter(r => r.path === currentPath)[0];
    if (route) {
      theaters.style.display = "none";
      search.style.display = "block";
    } else {
      view.innerHTML = "404: Route not found";
    }
  }
};

var count = 1;

function isVisible(elem) {
  let coords = document.documentElement.getBoundingClientRect();

  let windowHeight = document.documentElement.clientHeight;

  // top elem edge is visible OR bottom elem edge is visible
  let topVisible = coords.top > 0 && coords.top < windowHeight;
  let bottomVisible = coords.bottom <= windowHeight && coords.bottom > 0;
  if (bottomVisible) {
    getMovies("movie/now_playing", "genre/movie/list", ++count);
  }
  return topVisible || bottomVisible;
}

window.onscroll = isVisible;
