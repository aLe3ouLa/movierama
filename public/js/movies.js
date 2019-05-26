function get(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); 
    xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText);
}

function loadMovies(page) {
    let nowPlaying = get("https://api.themoviedb.org/3/movie/now_playing?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=" +
        page
    );
    let genres = get("https://api.themoviedb.org/3/genre/movie/list?api_key=bc50218d91157b1ba4f142ef7baaa6a0&language=en-US&page=1");
  
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