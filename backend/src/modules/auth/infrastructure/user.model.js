const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/db/sequelize');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true, // can be null for Google login users
    },
    google_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending_clearance', 'approved', 'departed', 'on_hold'),
      defaultValue: 'pending_clearance',
    },
    explorer_level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    passport_image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    national_id_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    passport_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: 'users',
    timestamps: true, // automatically manages created_at and updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

module.exports = User;
