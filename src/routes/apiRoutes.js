const express = require('express');
const router = express.Router();
const movieController = require('../controllers/apiController');
const validator = require('../middlewares/validator');

router.get('/movies', movieController.getAllMovies);
router.get('/movies/stats/summary', movieController.getMovieStats);
router.get('/movies/:id', movieController.getMovieById);
router.post('/movies', validator.validateMovie, movieController.addMovie);
router.put('/movies/:id', validator.validateMovie, movieController.updateMovie);
router.delete('/movies/:id', movieController.deleteMovie);

module.exports = router;