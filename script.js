const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1NmIwYmZjOTQzY2VkOGFlZWMzNGI2MWE3OTZkZmJjMCIsIm5iZiI6MTczNzQyMzIyNy43NzYsInN1YiI6IjY3OGVmOTdiZGM5NjAzZjk0ZDViMmEwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.3z4lLTlczx0iA1ntFiOtUzmENJS3u73sENuijYiKIJM",
  },
};
let watched = localStorage.getItem("watched") ? JSON.parse(localStorage.getItem("watched")) : [];
let liked = localStorage.getItem("liked") ? JSON.parse(localStorage.getItem("liked")) : [];
let watchlist = localStorage.getItem("watchlist") ? JSON.parse(localStorage.getItem("watchlist")) : [];
let watchedMovies = localStorage.getItem("watchedmovies") ? JSON.parse(localStorage.getItem("watchedmovies")) : [];
let likedMovies = localStorage.getItem("likedmovies") ? JSON.parse(localStorage.getItem("likedmovies")) : [];
let watchlistMovies = localStorage.getItem("watchlistmovies") ? JSON.parse(localStorage.getItem("watchlistmovies")) : [];
let watchedShows = localStorage.getItem("watchedshows") ? JSON.parse(localStorage.getItem("watchedshows")) : [];
let likedShows = localStorage.getItem("likedshows") ? JSON.parse(localStorage.getItem("likedshows")) : [];
let watchlistShows = localStorage.getItem("watchlistshows") ? JSON.parse(localStorage.getItem("watchlistshows")) : [];

document.addEventListener("click", (e) => {
  let cardID = e.target.parentElement.parentElement.getAttribute("data-id");
  let cardType = e.target.parentElement.parentElement.getAttribute("data-type");
  if (e.target.id === "watch") {
    if (e.target.src.includes("watched")) {
      e.target.src = "/media/watch.svg";
      watched.splice(watched.indexOf(cardID), 1);
      console.log(watchedMovies,cardType);
      if (cardType === "movie") {
        watchedMovies.splice(watchedMovies.indexOf(cardID), 1);
      } else {
        watchedShows.splice(watchedShows.indexOf(cardID), 1);
      }
    } else {
      e.target.src = "/media/watched.svg";
      watched.push(cardID);
      if (cardType === "movie") {
        watchedMovies.push(cardID);
      } else {
        watchedShows.push(cardID);
      }
    }
    localStorage.setItem("watched", JSON.stringify(watched));
    localStorage.setItem("watchedmovies", JSON.stringify(watchedMovies));
    localStorage.setItem("watchedshows", JSON.stringify(watchedShows));
  } else if (e.target.id === "like") {
    if (e.target.src.includes("liked")) {
      e.target.src = "/media/like.svg";
      liked.splice(liked.indexOf(cardID), 1);
      if (cardType === "movie") {
        likedMovies.splice(likedMovies.indexOf(cardID), 1);
      } else {
        likedShows.splice(likedShows.indexOf(cardID), 1);
      }
    } else {
      e.target.src = "/media/liked.svg";
      liked.push(cardID);
      if (cardType === "movie") {
        likedMovies.push(cardID);
      } else {
        likedShows.push(cardID);
      }
    }
    localStorage.setItem("liked", JSON.stringify(liked));
    localStorage.setItem("likedmovies", JSON.stringify(likedMovies));
    localStorage.setItem("likedshows", JSON.stringify(likedShows));
  } else if (e.target.id === "add") {
    if (e.target.src.includes("added")) {
      e.target.src = "/media/add.svg";
      watchlist.splice(watchlist.indexOf(cardID), 1);
      if (cardType === "movie") {
        watchlistMovies.splice(watchlistMovies.indexOf(cardID), 1);
      } else {
        watchlistShows.splice(watchlistShows.indexOf(cardID), 1);
      }
    } else {
      e.target.src = "/media/added.svg";
      watchlist.push(cardID);
      if (cardType === "movie") {
        watchlistMovies.push(cardID);
      } else {
        watchlistShows.push(cardID);
      }
    }
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    localStorage.setItem("watchlistmovies", JSON.stringify(watchlistMovies));
    localStorage.setItem("watchlistshows", JSON.stringify(watchlistShows));
  }
});
async function appendTitles(list, toAppend = resultsE) {
  const fetchExternalLinks = async (item, type) => {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/${type}/${item.id}/external_ids`, options);
      const res_1 = await res.json();
      return "https://www.imdb.com/title/" + res_1.imdb_id;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  for (const result of list) {
    try {
      let type = result.release_date ? "movie" : "tv";
      let releaseYear = result.release_date ? result.release_date.slice(0, 4) : result.first_air_date.slice(0, 4);
      let title = result.title ? result.title : result.name;
      if (title.length > 30) {
        title = title.slice(0, 30) + "...";
      }

      const imdbLink = await fetchExternalLinks(result, type);
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `<img class="card-poster" src="https://image.tmdb.org/t/p/w300${result.poster_path}">
      <a class="card-title" href="${imdbLink}" target="_blank">${title}</a>
      <div class="card-info"><span>
      ${releaseYear}</span><span><img src="/media/star.svg" class="info-star">
      ${Math.round(Number(result.vote_average) * 100) / 100}</span>
      </div>
      <div class="card-btns">
      <img src="${
        watched.includes(result.id.toString()) ? "/media/watched.svg" : "/media/watch.svg"
      }" id="watch" title="Add to Watched">
      <img src="${liked.includes(result.id.toString()) ? "/media/liked.svg" : "/media/like.svg"}" id="like" title="Like">
      <img src="${
        watchlist.includes(result.id.toString()) ? "/media/added.svg" : "/media/add.svg"
      }" id="add" title="Add to watchlist">
      </div>`;
      card.setAttribute("data-id", result.id);
      card.setAttribute("data-type", type);
      toAppend.appendChild(card);
    } catch (err) {
      console.error("Error fetching or rendering card:", err);
    }
  }
}

async function searchMovies(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?include_adult=true&language=en-US&page=1&query=${query}`,
    options
  );
  const data = await response.json();
  return data.results;
}

async function searchShows(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/tv?include_adult=false&language=en-US&page=1&query=${query}`,
    options
  );
  const data = await response.json();
  return data.results;
}
