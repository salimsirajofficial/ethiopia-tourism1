const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/db/sequelize');
const User = require('../../auth/infrastructure/user.model');
const Destination = require('./destination.model');

const Favorite = sequelize.define(
  'Favorite',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    destinationId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Destination,
        key: 'id'
      }
    }
  },
  {
    tableName: 'favorites',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

// Define associations
User.hasMany(Favorite, { foreignKey: 'userId', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Destination.hasMany(Favorite, { foreignKey: 'destinationId', as: 'favoritedBy' });
Favorite.belongsTo(Destination, { foreignKey: 'destinationId', as: 'destination' });

module.exports = Favorite;
