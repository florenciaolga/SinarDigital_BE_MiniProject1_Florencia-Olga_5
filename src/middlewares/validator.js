const validateMovie = (req, res, next) => {
  const { title, director, year, genre, rating, description } = req.body;

  if (!title || !director || !year || !genre || !rating) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      required: ["title", "director", "year", "genre", "rating"],
    });
  }

  const currentYear = new Date().getFullYear();
  if (isNaN(year) || year < 1888 || year > currentYear + 5) {
    return res.status(400).json({
      success: false,
      message: `Year must be between 1888 and ${currentYear + 5}`,
    });
  }

  if (isNaN(rating) || rating < 0 || rating > 10) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 0 and 10",
    });
  }

  next();
};

module.exports = {
  validateMovie,
};
