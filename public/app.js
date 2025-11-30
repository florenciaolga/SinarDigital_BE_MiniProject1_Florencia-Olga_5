let movies = [];
let editingMovieId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    loadStats();
});

const loadMovies = async (genre = '', sort = '') => {
    try {
        let url = '/api/movies';
        const params = new URLSearchParams();
        
        if (genre) params.append('genre', genre);
        if (sort) params.append('sort', sort);
        
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();
        
        movies = data.data;
        displayMovies(movies);
        updateGenreFilter();
    } catch (error) {
        console.error('Error loading movies:', error);
        showNotification('Failed to load movies', 'error');
    }
};

const displayMovies = (movieList) => {
    const grid = document.getElementById('moviesGrid');
    
    if (movieList.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 text-xl">No movies found. Add your first movie!</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = movieList.map(movie => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden card-hover">
            <div class="gradient-bg p-4">
                <h3 class="text-white text-xl font-bold truncate">${movie.title}</h3>
                <p class="text-purple-200 text-sm">Directed by ${movie.director}</p>
            </div>
            <div class="p-4">
                <div class="flex justify-between items-center mb-3">
                    <span class="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">${movie.genre}</span>
                    <span class="text-yellow-500 font-bold">⭐ ${movie.rating}</span>
                </div>
                <p class="text-gray-600 text-sm mb-3 line-clamp-3">${movie.description || 'No description available'}</p>
                <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm">📅 ${movie.year}</span>
                    <div class="flex gap-2">
                        <button onclick="editMovie(${movie.id})" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition duration-300">
                            ✏️ Edit
                        </button>
                        <button onclick="deleteMovie(${movie.id})" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition duration-300">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
};

const loadStats = async () => {
    try {
        const response = await fetch('/api/movies/stats/summary');
        const data = await response.json();
        const stats = data.data;

        document.getElementById('totalMovies').textContent = stats.totalMovies;
        document.getElementById('avgRating').textContent = stats.averageRating;
        document.getElementById('totalGenres').textContent = stats.genres.length;
        document.getElementById('latestMovie').textContent = stats.latestMovie ? stats.latestMovie.title : '-';
    } catch (error) {
        console.error('Error loading stats:', error);
    }
};

const updateGenreFilter = () => {
    const genreFilter = document.getElementById('genreFilter');
    const genres = [...new Set(movies.map(m => m.genre))];
    
    const currentValue = genreFilter.value;
    genreFilter.innerHTML = '<option value="">All Genres</option>';
    
    genres.forEach(genre => {
        genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
    });
    
    genreFilter.value = currentValue;
};

const filterMovies = () => {
    const genre = document.getElementById('genreFilter').value;
    const sort = document.getElementById('sortFilter').value;
    loadMovies(genre, sort);
};

const openAddModal = () => {
    editingMovieId = null;
    document.getElementById('modalTitle').textContent = 'Add New Movie';
    document.getElementById('movieForm').reset();
    document.getElementById('movieId').value = '';
    document.getElementById('movieModal').classList.add('active');
};

const editMovie = async (id) => {
    try {
        const response = await fetch(`/api/movies/${id}`);
        const data = await response.json();
        const movie = data.data;

        editingMovieId = id;
        document.getElementById('modalTitle').textContent = 'Edit Movie';
        document.getElementById('movieId').value = movie.id;
        document.getElementById('title').value = movie.title;
        document.getElementById('director').value = movie.director;
        document.getElementById('year').value = movie.year;
        document.getElementById('genre').value = movie.genre;
        document.getElementById('rating').value = movie.rating;
        document.getElementById('description').value = movie.description || '';
        
        document.getElementById('movieModal').classList.add('active');
    } catch (error) {
        console.error('Error loading movie:', error);
        showNotification('Failed to load movie details', 'error');
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();

    const movieData = {
        title: document.getElementById('title').value,
        director: document.getElementById('director').value,
        year: parseInt(document.getElementById('year').value),
        genre: document.getElementById('genre').value,
        rating: parseFloat(document.getElementById('rating').value),
        description: document.getElementById('description').value
    };

    try {
        let response;
        if (editingMovieId) {
            response = await fetch(`/api/movies/${editingMovieId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            });
        } else {
            response = await fetch('/api/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(movieData)
            });
        }

        const result = await response.json();

        if (result.success) {
            showNotification(result.message, 'success');
            closeModal();
            loadMovies();
            loadStats();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error saving movie:', error);
        showNotification('Failed to save movie', 'error');
    }
};

const deleteMovie = async (id) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    try {
        const response = await fetch(`/api/movies/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showNotification(result.message, 'success');
            loadMovies();
            loadStats();
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
        showNotification('Failed to delete movie', 'error');
    }
};

const closeModal = () => {
    document.getElementById('movieModal').classList.remove('active');
    document.getElementById('movieForm').reset();
    editingMovieId = null;
};

const showNotification = (message, type) => {
    const emoji = type === 'success' ? '✅' : '❌';
    alert(`${emoji} ${message}`);
};

document.getElementById('movieModal').addEventListener('click', (e) => {
    if (e.target.id === 'movieModal') {
        closeModal();
    }
});