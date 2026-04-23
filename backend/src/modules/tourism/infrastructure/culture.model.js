const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/db/sequelize');

const Culture = sequelize.define(
  'Culture',
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
    label: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    accent: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: 'from-amber-900/80',
    },
    number: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
  },
  {
    tableName: 'cultures',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = Culture;
