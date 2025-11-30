const filterMoviesByGenre = (movies, genre) => {
  return movies.filter(movie => 
    movie.genre.toLowerCase() === genre.toLowerCase()
  );
};

const calculateAverageRating = (movies) => {
  if (movies.length === 0) return 0;
  
  const totalRating = movies.reduce((sum, movie) => sum + movie.rating, 0);
  return (totalRating / movies.length).toFixed(2);
};

const sortMoviesByYear = (movies) => {
  return [...movies].sort((a, b) => b.year - a.year);
};

const getMoviesByDirector = (movies, director) => {
  return movies.filter(movie => 
    movie.director.toLowerCase().includes(director.toLowerCase())
  );
};

const getTopRatedMovies = (movies, limit = 5) => {
  return [...movies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

module.exports = {
  filterMoviesByGenre,
  calculateAverageRating,
  sortMoviesByYear,
  getMoviesByDirector,
  getTopRatedMovies
};