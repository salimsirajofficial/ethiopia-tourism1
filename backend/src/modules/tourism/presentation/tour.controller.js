const Tour = require('../infrastructure/tour.model');
const logger = require('../../../shared/utils/logger');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.findAll();
    res.json(tours);
  } catch (error) {
    logger.error('Error fetching tours:', error.message);
    res.status(500).json({ message: 'Error fetching tours' });
  }
};

exports.getTourById = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    res.json(tour);
  } catch (error) {
    logger.error('Error fetching tour by ID:', error.message);
    res.status(500).json({ message: 'Error fetching tour' });
  }
};

exports.createTour = async (req, res) => {
  try {
    const {
      title, subtitle, description, highlight, image, video_url,
      duration, groupSize, location, basePrice,
      difficulty, tags, itinerary
    } = req.body;

    // Process JSON fields if they come as strings
    let processedTags = tags;
    if (typeof tags === 'string') {
      try { processedTags = JSON.parse(tags); } catch (e) { processedTags = []; }
    }

    let processedItinerary = itinerary;
    if (typeof itinerary === 'string') {
      try { processedItinerary = JSON.parse(itinerary); } catch (e) { processedItinerary = []; }
    }

    const tour = await Tour.create({
      title,
      subtitle,
      description,
      highlight,
      image, // Direct URL
      video_url, // Direct URL
      duration,
      groupSize,
      location,
      basePrice: parseInt(basePrice || 0),
      difficulty,
      tags: processedTags || [],
      itinerary: processedItinerary || [],
    });

    res.status(201).json(tour);
  } catch (error) {
    logger.error('Error creating tour:', error.message);
    res.status(500).json({ message: 'Error creating tour: ' + error.message });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    const {
      title, subtitle, description, highlight, image, video_url,
      duration, groupSize, location, basePrice,
      difficulty, tags, itinerary
    } = req.body;

    // Process JSON fields
    let processedTags = tags;
    if (tags && typeof tags === 'string') {
      try { processedTags = JSON.parse(tags); } catch (e) { processedTags = tour.tags; }
    }

    let processedItinerary = itinerary;
    if (itinerary && typeof itinerary === 'string') {
      try { processedItinerary = JSON.parse(itinerary); } catch (e) { processedItinerary = tour.itinerary; }
    }

    await tour.update({
      title: title || tour.title,
      subtitle: subtitle !== undefined ? subtitle : tour.subtitle,
      description: description || tour.description,
      highlight: highlight !== undefined ? highlight : tour.highlight,
      image: image || tour.image,
      video_url: video_url !== undefined ? video_url : tour.video_url,
      duration: duration || tour.duration,
      groupSize: groupSize || tour.groupSize,
      location: location || tour.location,
      basePrice: basePrice !== undefined ? parseInt(basePrice) : tour.basePrice,
      difficulty: difficulty || tour.difficulty,
      tags: processedTags || tour.tags,
      itinerary: processedItinerary || tour.itinerary,
    });

    res.json(tour);
  } catch (error) {
    logger.error('Error updating tour:', error.message);
    res.status(500).json({ message: 'Error updating tour: ' + error.message });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByPk(req.params.id);
    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }
    await tour.destroy();
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    logger.error('Error deleting tour:', error.message);
    res.status(500).json({ message: 'Error deleting tour' });
  }
};
