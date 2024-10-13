// code here

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  const poster = document.getElementById("poster");
  const titleElement = document.getElementById("title");
  const runtimeElement = document.getElementById("runtime");
  const descriptionElement = document.getElementById("film-info");
  const showtimeElement = document.getElementById("showtime");
  const ticketNumElement = document.getElementById("ticket-num");
  const buyTicketButton = document.getElementById("buy-ticket");
  const movieListContainer = document.getElementById("films");

  loadMovies(movieListContainer);
  loadFirstMovie();
}

function loadMovies(container) {
  fetch("http://localhost:3000/films")
    .then((response) => response.json())
    .then((movies) => {
      container.innerHTML = ""; 
      movies.forEach((movie) => createMovieListItem(container, movie));
    });
}

function createMovieListItem(container, movie) {
  const li = document.createElement("li");
  li.classList.add("film", "item");
  li.textContent = movie.title;
  li.setAttribute("data-id", movie.id); 

  
  addDeleteButton(li, movie.id);

  
  li.addEventListener("click", () => {
    fetchMovieDetails(movie.id);
  });

  container.appendChild(li);
}

function addDeleteButton(li, movieId) {
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("delete-button", "ui", "red", "button");

  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation(); 
    deleteMovie(movieId, li);
  });

  li.appendChild(deleteButton);
}

function deleteMovie(movieId, listItem) {
  fetch(`http://localhost:3000/films/${movieId}`, {
    method: "DELETE",
  }).then(() => {
    listItem.remove(); 
  });
}

function loadFirstMovie() {
  fetch("http://localhost:3000/films/1")
    .then((response) => response.json())
    .then((movie) => displayMovieDetails(movie));
}

function fetchMovieDetails(movieId) {
  fetch(`http://localhost:3000/films/${movieId}`)
    .then((response) => response.json())
    .then((movie) => displayMovieDetails(movie));
}

function displayMovieDetails(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;
  updateMovieUI(movie, availableTickets);
  updateBuyTicketButton(movie, availableTickets);
}

function updateMovieUI(movie, availableTickets) {
  document.getElementById("poster").src = movie.poster;
  document.getElementById("title").textContent = movie.title;
  document.getElementById("runtime").textContent = `${movie.runtime} minutes`;
  document.getElementById("film-info").textContent = movie.description;
  document.getElementById("showtime").textContent = movie.showtime;
  document.getElementById("ticket-num").textContent = `${availableTickets} remaining tickets`;

  // Update movie list item class if sold out
  const movieListItem = document.querySelector(`li[data-id="${movie.id}"]`);
  if (availableTickets === 0) {
    movieListItem.classList.add("sold-out");
  } else {
    movieListItem.classList.remove("sold-out");
  }
}

function updateBuyTicketButton(movie, availableTickets) {
  const buyTicketButton = document.getElementById("buy-ticket");
  if (availableTickets === 0) {
    buyTicketButton.textContent = "Sold Out";
    buyTicketButton.disabled = true;
  } else {
    buyTicketButton.textContent = "Buy Ticket";
    buyTicketButton.disabled = false;
    buyTicketButton.onclick = () => buyTicket(movie);
  }
}

function buyTicket(movie) {
  const availableTickets = movie.capacity - movie.tickets_sold;

  if (availableTickets > 0) {
    const updatedTicketsSold = movie.tickets_sold + 1;

    
    fetch(`http://localhost:3000/films/${movie.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
    })
      .then((response) => response.json())
      .then((updatedMovie) => {
        displayMovieDetails(updatedMovie);
      });
  }
}

  
