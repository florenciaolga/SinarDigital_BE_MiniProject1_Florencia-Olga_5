const express = require('express');
const router = express.Router();
const apiRoutes = require('./apiRoutes');

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Movie Collection Manager API! 🎬',
    endpoints: {
      movies: {
        getAll: 'GET /api/movies',
        getById: 'GET /api/movies/:id',
        add: 'POST /api/movies',
        update: 'PUT /api/movies/:id',
        delete: 'DELETE /api/movies/:id'
      },
      stats: 'GET /api/movies/stats/summary'
    }
  });
});

// api
router.use('/api', apiRoutes);

module.exports = router;