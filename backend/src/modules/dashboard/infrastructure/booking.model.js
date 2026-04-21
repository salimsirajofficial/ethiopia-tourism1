const { DataTypes } = require('sequelize');
const sequelize = require('../../../shared/db/sequelize');

const Booking = sequelize.define(
  'Booking',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    destination_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    tour_id: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    travel_class: {
      type: DataTypes.ENUM('economy', 'business', 'first'),
      defaultValue: 'first',
    },
    network_id: {
      type: DataTypes.STRING(50),
      unique: true,
    },
    issue_hash: {
      type: DataTypes.STRING(64),
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    passport_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    special_requests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('application', 'pending', 'waiting_payment', 'clearance', 'departure', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    application_date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    clearance_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    departure_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    guests: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
  },
  {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: (booking) => {
        if (!booking.network_id) {
          booking.network_id = `ETH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
          booking.issue_hash = `#${Math.random().toString(36).substring(2, 8)}`;
        }
      },
    },
  }
);

module.exports = Booking;
