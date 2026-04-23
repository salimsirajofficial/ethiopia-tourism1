const Culture = require('../infrastructure/culture.model');
const logger = require('../../../shared/utils/logger');

exports.getAllCultures = async (req, res) => {
  try {
    const cultures = await Culture.findAll({
      order: [['number', 'ASC'], ['created_at', 'ASC']]
    });
    res.json(cultures);
  } catch (error) {
    logger.error('Error fetching cultures:', error.message);
    res.status(500).json({ message: 'Error fetching cultures' });
  }
};

exports.getCultureById = async (req, res) => {
  try {
    const culture = await Culture.findByPk(req.params.id);
    if (!culture) {
      return res.status(404).json({ message: 'Culture item not found' });
    }
    res.json(culture);
  } catch (error) {
    logger.error('Error fetching culture by ID:', error.message);
    res.status(500).json({ message: 'Error fetching culture item' });
  }
};

exports.createCulture = async (req, res) => {
  try {
    const { 
      title, amharic, label, description, 
      detail, image, accent, number 
    } = req.body;

    if (!title || !description || !image) {
      return res.status(400).json({ message: 'Missing required fields (title, description, image)' });
    }

    const culture = await Culture.create({
      title, 
      amharic, 
      label, 
      description, 
      detail, 
      image, 
      accent, 
      number
    });

    res.status(201).json(culture);
  } catch (error) {
    logger.error('Error creating culture:', error.message);
    res.status(500).json({ message: 'Error creating culture item' });
  }
};

exports.updateCulture = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, amharic, label, description, 
      detail, image, accent, number 
    } = req.body;

    const culture = await Culture.findByPk(id);
    if (!culture) {
      return res.status(404).json({ message: 'Culture item not found' });
    }

    await culture.update({
      title, 
      amharic, 
      label, 
      description, 
      detail, 
      image, 
      accent, 
      number
    });

    res.json(culture);
  } catch (error) {
    logger.error('Error updating culture:', error.message);
    res.status(500).json({ message: 'Error updating culture item' });
  }
};

exports.deleteCulture = async (req, res) => {
  try {
    const { id } = req.params;
    const culture = await Culture.findByPk(id);
    if (!culture) {
      return res.status(404).json({ message: 'Culture item not found' });
    }

    await culture.destroy();
    res.json({ message: 'Culture item deleted successfully' });
  } catch (error) {
    logger.error('Error deleting culture:', error.message);
    res.status(500).json({ message: 'Error deleting culture item' });
  }
};
