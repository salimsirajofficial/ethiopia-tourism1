const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/db/sequelize');

const Destination = sequelize.define(
  'Destination',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    amharic: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    region: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    bestTime: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    duration: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    basePrice: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    video_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'destinations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Destination;
