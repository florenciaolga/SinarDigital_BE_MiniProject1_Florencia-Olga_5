const fs = require("fs").promises;
const path = require("path");
const {
  filterMoviesByGenre,
  calculateAverageRating,
  sortMoviesByYear,
} = require("../utils/helpers");

const DATA_PATH = path.join(__dirname, "../../data/data.json");

// Read data
const readData = async () => {
  const data = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(data);
};

const writeData = async (data) => {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
};

const getAllMovies = async (req, res, next) => {
  try {
    const data = await readData();
    const { genre, sort } = req.query;

    let movies = data.movies;

    if (genre) {
      movies = filterMoviesByGenre(movies, genre);
    }
    if (sort === "year") {
      movies = sortMoviesByYear(movies);
    }

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    next(error);
  }
};
const getMovieById = async (req, res, next) => {
  try {
    const data = await readData();
    const movie = data.movies.find((m) => m.id === parseInt(req.params.id));

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (error) {
    next(error);
  }
};

const addMovie = async (req, res, next) => {
  try {
    const data = await readData();
    const { title, director, year, genre, rating, description } = req.body;

    const newId =
      data.movies.length > 0
        ? Math.max(...data.movies.map((m) => m.id)) + 1
        : 1;

    const newMovie = {
      id: newId,
      title,
      director,
      year: parseInt(year),
      genre,
      rating: parseFloat(rating),
      description,
    };

    data.movies.push(newMovie);
    await writeData(data);

    res.status(201).json({
      success: true,
      message: "Movie added successfully",
      data: newMovie,
    });
  } catch (error) {
    next(error);
  }
};

const updateMovie = async (req, res, next) => {
  try {
    const data = await readData();
    const movieIndex = data.movies.findIndex(
      (m) => m.id === parseInt(req.params.id)
    );

    if (movieIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const { title, director, year, genre, rating, description } = req.body;

    data.movies[movieIndex] = {
      ...data.movies[movieIndex],
      title,
      director,
      year: parseInt(year),
      genre,
      rating: parseFloat(rating),
      description,
    };

    await writeData(data);

    res.json({
      success: true,
      message: "Movie updated successfully",
      data: data.movies[movieIndex],
    });
  } catch (error) {
    next(error);
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const data = await readData();
    const movieIndex = data.movies.findIndex(
      (m) => m.id === parseInt(req.params.id)
    );

    if (movieIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    const deletedMovie = data.movies.splice(movieIndex, 1)[0];
    await writeData(data);

    res.json({
      success: true,
      message: "Movie deleted successfully",
      data: deletedMovie,
    });
  } catch (error) {
    next(error);
  }
};

const getMovieStats = async (req, res, next) => {
  try {
    const data = await readData();
    const movies = data.movies;

    const stats = {
      totalMovies: movies.length,
      averageRating: calculateAverageRating(movies),
      genres: [...new Set(movies.map((m) => m.genre))],
      latestMovie: movies.reduce(
        (latest, movie) => (movie.year > latest.year ? movie : latest),
        movies[0]
      ),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovie,
  getMovieStats,
};
