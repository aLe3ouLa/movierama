var API_KEY = "bc50218d91157b1ba4f142ef7baaa6a0";
var movie_url = "https://api.themoviedb.org/3/";
var images_url = "";

function get(theUrl) {
  /** GET request to movieDB API */
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl, false);
  xmlHttp.send(null);
  return JSON.parse(xmlHttp.responseText);
}

function getMovies(nowPlayingURL, genreURL, page) {
  /* Create The URLS */
  let nowPlaying = get(
    movie_url +
      nowPlayingURL +
      "?api_key=" +
      API_KEY +
      "&language=en-US&page=" +
      page
  );
  let genres = get(
    movie_url + genreURL + "?api_key=" + API_KEY + "&language=en-US&page=1"
  );

  // Cache of the template
  let template = document.getElementById("template-list-item");
  // Get the contents of the template
  let templateHtml = template.innerHTML;
  let listHtml = "";

  // Loop through dataObject, replace placeholder tags
  // with actual data, and generate final HTML
  for (let i = 0; i < nowPlaying.results.length; i++) {
    let genre_ids = nowPlaying.results[i].genre_ids;
    let movieGenre = "";
    /** Get the genres of its movie */
    if (genre_ids.length > 0) {
      for (let j = 0; j < genre_ids.length; j++) {
        movieGenre +=
          genres.genres.filter(r => r.id === genre_ids[j])[0].name + " ";
      }
    }

    /** Replace the placeholders with the actual data */
    listHtml += templateHtml
      .replace(/{{id}}/g, nowPlaying.results[i]["id"])
      .replace(/{{title}}/g, nowPlaying.results[i]["title"])
      .replace(/{{genres}}/g, movieGenre)
      .replace(/{{vote_average}}/g, nowPlaying.results[i]["vote_average"])
      .replace(
        /{{year}}/g,
        new Date(nowPlaying.results[i]["release_date"]).getFullYear()
      )
      .replace(/{{overview}}/g, nowPlaying.results[i]["overview"])
      .replace(/{{url}}/g, nowPlaying.results[i]["poster_path"]);
  }

  // Replace the HTML of #list with final HTML
  let lst = document.getElementById("ul-list");
  lst.innerHTML += listHtml;
}

function searchMovie() {
  let val = document.getElementById("searchMovie");
  let query =
    movie_url +
    "search/movie?include_adult=false&page=1&language=en-US&api_key=" +
    API_KEY +
    "&query=" +
    val.value;
  let movies = get(query);
  currentPath = "/search";
  createTemplateSearched(movies);
}

function createTemplateSearched(movies) {
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
      .replace(
        /{{year}}/g,
        new Date(movies.results[i]["release_date"]).getFullYear()
      )
      .replace(/{{overview}}/g, movies.results[i]["overview"])
      .replace(/{{url}}/g, movies.results[i]["poster_path"]);
  }
  listHtml += "";

  // Replace the HTML of #list with final HTML
  let lst = document.getElementById("ul-list-search");
  lst.innerHTML = listHtml;
}

function showDetails(id) {
  let videos = get(
    movie_url +
      "movie/" +
      id +
      "/videos?api_key=" +
      API_KEY +
      "&language=en-US&page=1"
  );
  let reviews = get(
    movie_url +
      "movie/" +
      id +
      "/reviews?api_key=" +
      API_KEY +
      "&language=en-US&page=1"
  );
  let similar = get(
    movie_url +
      "movie/" +
      id +
      "/similar?api_key=" +
      API_KEY +
      "&language=en-US&page=1"
  );

  document.getElementById("additional" + id).style.display = "block";
  let lst = document.getElementById("details" + id);
  lst.innerHTML = templateSimilar(similar);
  let lstTrailers = document.getElementById("trailers" + id);
  lstTrailers.innerHTML += templateVideos(videos);
  let lstReviews = document.getElementById("reviews" + id);
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
      .replace(
        /{{year}}/g,
        new Date(similar.results[i]["release_date"]).getFullYear()
      )
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
  let templateHtmlReviews = templateReviews.innerHTML;
  // Final HTML variable as empty string
  let listHtmlReviews = "";
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

