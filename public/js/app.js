window.onload = function() {
  var view = document.getElementById("view");
  var theaters = document.getElementById("theaters");
  var search = document.getElementById("search");

  var activeRoutes = Array.from(document.querySelectorAll("[route]"));
  function navigate(event) {
    let route = event.target.attributes[0].value;
    let routeInfo = myFirstRouter.routes.filter(r => r.path === route)[0];
    console.log(routeInfo);
    if (!routeInfo) {
    //   view.innerHTML = "No route exists with this path";
    } else {
      window.history.pushState({}, "name", routeInfo.path);
    //   view.innerHTML = " You have clicked the " + routeInfo.name + " route";
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
    theaters.style.display = "block";
    search.style.display = "none";
  } else {
    var route = myFirstRouter.routes.filter(r => r.path === currentPath)[0];

    if (route) {
    //   view.innerHTML = "You are on the " + route ? route.name : "" + "path";
      theaters.style.display = "none";
      search.style.display = "block";
    } else {
    //   view.innerHTML = "404: Route not found";
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
      .replace(/{{year}}/g, new Date(nowPlaying.results[i]["release_date"]).getFullYear())
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

function showDetails(id) {
    let movie = getHttpRequest("https://api.themoviedb.org/3/movie/" + id +"?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1");
    let videos = getHttpRequest("https://api.themoviedb.org/3/movie/" + id +"/videos?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1");
    let reviews = getHttpRequest("https://api.themoviedb.org/3/movie/" + id +"/reviews?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1");
    let similar = getHttpRequest("https://api.themoviedb.org/3/movie/" + id +"/similar?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1");

    console.log(similar)

  document.getElementById("additional"+id).style.display = "block";
  let lst = document.getElementById("details"+id);
  lst.innerHTML = templateSimilar(similar);
  let lstTrailers = document.getElementById("trailers"+id);
  lstTrailers.innerHTML += templateVideos(videos);
  let lstReviews = document.getElementById("reviews"+id);
  lstReviews.innerHTML = templateReviews(reviews);
  

}

function templateSimilar(similar) {
  let template = document.getElementById("template-list-details");
  // Get the contents of the template
  let templateHtml = template.innerHTML;
  // Final HTML variable as empty string
  let listHtml = "";
  for (let i = 0; i < similar.results.length; i++) {
    listHtml += templateHtml
      .replace(/{{id}}/g, similar.results[i]["id"])
      .replace(/{{title}}/g, similar.results[i]["title"])
      .replace(/{{year}}/g, new Date(similar.results[i]["release_date"]).getFullYear())
      .replace(/{{url}}/g, similar.results[i]["poster_path"]);
      
  }
  return listHtml;
}

function templateVideos(videos) {

  let templateVideos = document.getElementById("template-list-videos-li");
  // Get the contents of the template
  let templateHtmlVideos = templateVideos.innerHTML;
  // Final HTML variable as empty string
  let listHtmlVideos = "";
  for (let i = 0; i < videos.results.length; i++) {
    listHtmlVideos += templateHtmlVideos
      .replace(/{{id}}/g, videos.results[i]["id"])
      .replace(/{{name}}/g, videos.results[i]["name"])
      .replace(/{{url}}/g, videos.results[i]["key"]);
  }

  return listHtmlVideos;
}

function templateReviews(reviews) {
  let templateReviews = document.getElementById("template-list-reviews");
  // Get the contents of the template
  let templateHtmlReviews= templateReviews.innerHTML;
  // Final HTML variable as empty string
  let listHtmlReviews = "";
  console.log(reviews)
  if (reviews.results.length > 0 && reviews.results.length <= 2) {
    for (let i = 0; i < reviews.results.length; i++) {
      listHtmlReviews += templateHtmlReviews
        .replace(/{{id}}/g, reviews.results[i]["id"])
        .replace(/{{content}}/g, reviews.results[i]["content"])
        .replace(/{{author}}/g, reviews.results[i]["author"]);
    }
  }
  return listHtmlReviews;
}

function searchMovie() {
    let val = document.getElementById("searchMovie");
    let query = "https://api.themoviedb.org/3/search/movie?include_adult=false&page=1&language=en-US&api_key=bc50218d91157b1ba4f142ef7baaa6a0&query=" + val.value;
    let movies = getHttpRequest(query);
    currentPath="/search"
    console.log(movies)
    loadSearchMovies(movies);
}

function loadSearchMovies(movies) {
    // Cache of the template
    let template = document.getElementById("template-list-item");
    
    // Get the contents of the template
    let templateHtml = template.innerHTML;
    // Final HTML variable as empty string
    let listHtml = "";
  
    // Loop through dataObject, replace placeholder tags
    // with actual data, and generate final HTML

    for (let i = 0; i < movies.results.length; i++) {
      listHtml += templateHtml
        .replace(/{{id}}/g, movies.results[i]["id"])
        .replace(/{{title}}/g, movies.results[i]["title"])
        .replace(/{{vote_average}}/g, movies.results[i]["vote_average"])
        .replace(/{{year}}/g, new Date(movies.results[i]["release_date"]).getFullYear())
        .replace(/{{overview}}/g, movies.results[i]["overview"])
        .replace(/{{url}}/g, movies.results[i]["poster_path"]);
    }
    listHtml+="";
  
    // Replace the HTML of #list with final HTML
    let lst = document.getElementById("ul-list-search");
    lst.innerHTML = listHtml;
  }