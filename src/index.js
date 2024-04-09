// Your code here
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch movie details from backend
    const fetchMovieDetails = async () => {
        try {
            const response = await fetch('http://localhost:3000/films/1');
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            const movie = await response.json();
            // Call a function to display movie details
            displayMovieDetails(movie);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to display movie details on the frontend
    const displayMovieDetails = (movie) => {
        // Get elements to display movie details
        const posterElement = document.getElementById('poster');
        const titleElement = document.getElementById('title');
        const runtimeElement = document.getElementById('runtime');
        const showtimeElement = document.getElementById('showtime');
        const ticketsElement = document.getElementById('available-tickets');

        // Display movie details
        posterElement.src = movie.poster;
        titleElement.textContent = movie.title;
        runtimeElement.textContent = `Runtime: ${movie.runtime} mins`;
        showtimeElement.textContent = `Showtime: ${movie.showtime}`;
        const availableTickets = movie.capacity - movie.tickets_sold;
        ticketsElement.textContent = `Available Tickets: ${availableTickets}`;
    };

    // Call the fetchMovieDetails function when the page loads
    fetchMovieDetails();
});
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch all movies from the backend
    const fetchAllMovies = async () => {
        try {
            const response = await fetch('http://localhost:3000/films');
            if (!response.ok) {
                throw new Error('Failed to fetch movies');
            }
            const movies = await response.json();
            // Call a function to display the list of movies
            displayMovieList(movies);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to fetch movie details from backend
    const fetchMovieDetails = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/films/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch movie details');
            }
            const movie = await response.json();
            // Call a function to display movie details
            displayMovieDetails(movie);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to display movie details on the frontend
    const displayMovieDetails = (movie) => {
        // Get elements to display movie details
        const posterElement = document.getElementById('poster');
        const titleElement = document.getElementById('title');
        const runtimeElement = document.getElementById('runtime');
        const showtimeElement = document.getElementById('showtime');
        const ticketsElement = document.getElementById('available-tickets');

        // Display movie details
        posterElement.src = movie.poster;
        titleElement.textContent = movie.title;
        runtimeElement.textContent = `Runtime: ${movie.runtime} mins`;
        showtimeElement.textContent = `Showtime: ${movie.showtime}`;
        const availableTickets = movie.capacity - movie.tickets_sold;
        ticketsElement.textContent = `Available Tickets: ${availableTickets}`;
    };

    // Function to display the list of movies on the frontend
    const displayMovieList = (movies) => {
        // Get the films list element
        const filmsList = document.getElementById('films');

        // Clear existing content
        filmsList.innerHTML = '';

        // Iterate over each movie and create list item
        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.textContent = movie.title;
            listItem.classList.add('film', 'item');
            // Add event listener to handle movie selection
            listItem.addEventListener('click', () => {
                fetchMovieDetails(movie.id);
            });
            filmsList.appendChild(listItem);
        });
    };

    // Call the fetchAllMovies function when the page loads
    fetchAllMovies();
});
// Function to handle buying tickets for a movie
const buyTicket = async (movie) => {
    try {
        // Check if there are available tickets
        const availableTickets = movie.capacity - movie.tickets_sold;
        if (availableTickets > 0) {
            // Update the number of tickets sold on the frontend
            movie.tickets_sold++;
            // Display updated available tickets count
            const ticketsElement = document.getElementById('available-tickets');
            ticketsElement.textContent = `Available Tickets: ${availableTickets - 1}`;
            
            // Update the backend with the new tickets_sold count
            const response = await fetch(`http://localhost:3000/films/${movie.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: movie.tickets_sold
                })
            });
            if (!response.ok) {
                throw new Error('Failed to update tickets');
            }
            
            // Add the new ticket to the tickets endpoint in the database
            const ticketResponse = await fetch('http://localhost:3000/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    film_id: movie.id,
                    number_of_tickets: 1 // Assuming user buys one ticket at a time
                })
            });
            if (!ticketResponse.ok) {
                throw new Error('Failed to add ticket');
            }
        } else {
            // Display message if no tickets are available
            console.log('Sorry, this showing is sold out!');
        }
    } catch (error) {
        console.error(error);
    }
    // Get the "Buy Ticket" button element
const buyTicketButton = document.getElementById('buy-ticket');

// Add event listener to the "Buy Ticket" button
buyTicketButton.addEventListener('click', () => {
    buyTicket(movie); // Call the buyTicket function passing the movie object
});

};
// Function to handle deleting a film
const deleteFilm = async (filmId) => {
    try {
        // Remove the film from the frontend
        const filmToRemove = document.getElementById(`film-${filmId}`);
        filmToRemove.remove();

        // Delete the film from the server
        const response = await fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Failed to delete film');
        }
    } catch (error) {
        console.error(error);
    }
};

// Function to display the list of movies on the frontend
const displayMovieList = (movies) => {
    // Get the films list element
    const filmsList = document.getElementById('films');

    // Clear existing content
    filmsList.innerHTML = '';

    // Iterate over each movie and create list item
    movies.forEach(movie => {
        const listItem = document.createElement('li');
        listItem.textContent = movie.title;
        listItem.id = `film-${movie.id}`; // Set id for each film item
        listItem.classList.add('film', 'item');

        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Stop propagation to prevent triggering click event on the film item
            deleteFilm(movie.id);
        });

        // Append delete button to the film item
        listItem.appendChild(deleteButton);

        // Add event listener to handle movie selection
        listItem.addEventListener('click', () => {
            displayMovieDetails(movie);
        });

        filmsList.appendChild(listItem);
    });
};
// Function to display movie details on the frontend
const displayMovieDetails = (movie) => {
    // Get elements to display movie details
    const posterElement = document.getElementById('poster');
    const titleElement = document.getElementById('title');
    const runtimeElement = document.getElementById('runtime');
    const showtimeElement = document.getElementById('showtime');
    const ticketsElement = document.getElementById('available-tickets');
    const buyTicketButton = document.getElementById('buy-ticket');

    // Display movie details
    posterElement.src = movie.poster;
    titleElement.textContent = movie.title;
    runtimeElement.textContent = `Runtime: ${movie.runtime} mins`;
    showtimeElement.textContent = `Showtime: ${movie.showtime}`;
    const availableTickets = movie.capacity - movie.tickets_sold;
    ticketsElement.textContent = `Available Tickets: ${availableTickets}`;

    // Check if movie is sold out
    if (availableTickets === 0) {
        // Disable "Buy Ticket" button and change text to "Sold Out"
        buyTicketButton.disabled = true;
        buyTicketButton.textContent = 'Sold Out';
        // Add class "sold-out" to film item
        const filmItem = document.getElementById(`film-${movie.id}`);
        filmItem.classList.add('sold-out');
    } else {
        // Enable "Buy Ticket" button and change text back to "Buy Ticket"
        buyTicketButton.disabled = false;
        buyTicketButton.textContent = 'Buy Ticket';
        // Remove class "sold-out" from film item
        const filmItem = document.getElementById(`film-${movie.id}`);
        filmItem.classList.remove('sold-out');
    }
};



  