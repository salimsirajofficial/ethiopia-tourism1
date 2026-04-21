const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/db/sequelize');

const Tour = sequelize.define(
  'Tour',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    subtitle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    highlight: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    video_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    groupSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    basePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    difficulty: {
      type: DataTypes.STRING(50),
      allowNull: true, // Easy, Moderate, Challenging
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    itinerary: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    tableName: 'tours',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Tour;
