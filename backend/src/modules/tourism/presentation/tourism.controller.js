const Destination = require('../infrastructure/destination.model');
const Favorite = require('../infrastructure/favorite.model');
const logger = require('../../../shared/utils/logger');

exports.getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.findAll();
    res.json(destinations);
  } catch (error) {
    logger.error('Error fetching destinations:', error.message);
    res.status(500).json({ message: 'Error fetching destinations' });
  }
};

exports.getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    logger.error('Error fetching destination by ID:', error.message);
    res.status(500).json({ message: 'Error fetching destination' });
  }
};

exports.createDestination = async (req, res) => {
  try {
    const { 
      title, amharic, code, region, description, 
      tag, color, bestTime, duration, basePrice,
      image, video_url 
    } = req.body;

    let imagePath = image || '';

    if (req.file) {
      imagePath = '/assets/images/dynamic/' + req.file.filename;
    }

    if (!imagePath || !title || !code || !description) {
      return res.status(400).json({ message: 'Missing required fields (title, code, description, image)' });
    }

    const destination = await Destination.create({
      title, 
      amharic, 
      code, 
      region, 
      description, 
      image: imagePath, 
      tag, 
      color, 
      bestTime, 
      duration, 
      basePrice: parseInt(basePrice || 0),
      video_url
    });

    res.status(201).json(destination);
  } catch (error) {
    logger.error('Error creating destination:', error.message);
    res.status(500).json({ message: 'Error creating destination: ' + error.message });
  }
};

exports.updateDestination = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, amharic, code, region, description, 
      tag, color, bestTime, duration, basePrice,
      image, video_url 
    } = req.body;

    const destination = await Destination.findByPk(id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    let imagePath = image || destination.image;
    if (req.file) {
      imagePath = '/assets/images/dynamic/' + req.file.filename;
    }

    await destination.update({
      title, 
      amharic, 
      code, 
      region, 
      description, 
      image: imagePath, 
      tag, 
      color, 
      bestTime, 
      duration, 
      basePrice: parseInt(basePrice || 0),
      video_url
    });

    res.json(destination);
  } catch (error) {
    logger.error('Error updating destination:', error.message);
    res.status(500).json({ message: 'Error updating destination: ' + error.message });
  }
};

exports.getFavorites = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{ model: Destination, as: 'destination' }]
    });
    res.json(favorites);
  } catch (error) {
    logger.error('Error fetching favorites:', error.message);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

exports.toggleFavorite = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { destinationId } = req.params;
  try {
    const existing = await Favorite.findOne({
      where: { userId: req.user.id, destinationId }
    });

    if (existing) {
      await existing.destroy();
      return res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      const favorite = await Favorite.create({ userId: req.user.id, destinationId });
      // Fetch eager loaded destination to send back
      const favWithDest = await Favorite.findByPk(favorite.id, {
        include: [{ model: Destination, as: 'destination' }]
      });
      return res.status(201).json({ message: 'Added to favorites', isFavorite: true, favorite: favWithDest });
    }
  } catch (error) {
    logger.error('Error toggling favorite:', error.message);
    res.status(500).json({ message: 'Error toggling favorite' });
  }
};

exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    // Delete associated favorites first to maintain referential integrity
    await Favorite.destroy({ where: { destinationId: destination.id } });
    await destination.destroy();
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    logger.error('Error deleting destination:', error.message);
    res.status(500).json({ message: 'Error deleting destination' });
  }
};
