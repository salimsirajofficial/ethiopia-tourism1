const express = require('express');
const router = express.Router();
const tourismController = require('./tourism.controller');
const tourController = require('./tour.controller');
const requireAuth = require('../../../shared/middleware/authMiddleware');
const upload = require('../../../shared/utils/upload');

// Destinations
router.get('/destinations', tourismController.getAllDestinations);
router.get('/destinations/:id', tourismController.getDestinationById);

router.post('/destinations', requireAuth, upload.single('imageFile'), tourismController.createDestination);
router.delete('/destinations/:id', requireAuth, tourismController.deleteDestination);

// Tours
router.get('/tours', tourController.getAllTours);
router.get('/tours/:id', tourController.getTourById);
router.post('/tours', requireAuth, tourController.createTour);
router.put('/tours/:id', requireAuth, tourController.updateTour);
router.delete('/tours/:id', requireAuth, tourController.deleteTour);

// Favorites
router.get('/favorites', requireAuth, tourismController.getFavorites);
router.post('/favorites/toggle/:destinationId', requireAuth, tourismController.toggleFavorite);

module.exports = router;
