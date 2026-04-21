const Booking = require('./booking.model');

const BookingRepository = {
  /** Maps a Sequelize record to a clean DTO. */
  _toDTO(record) {
    return {
      id:              record.id,
      userId:          record.user_id,
      destinationCode: record.destination_code,
      tourId:          record.tour_id,
      travelClass:     record.travel_class,
      networkId:       record.network_id,
      issueHash:       record.issue_hash,
      phone:           record.phone,
      passportId:      record.passport_id,
      specialRequests: record.special_requests,
      status:          record.status,
      applicationDate: record.application_date,
      clearanceDate:   record.clearance_date,
      departureDate:   record.departure_date,
      returnDate:      record.return_date,
      guests:          record.guests,
      createdAt:       record.created_at,
    };
  },

  /** Finds all bookings for a user, ordered by most recent. */
  async findAllByUserId(userId) {
    const records = await Booking.findAll({
      where: { user_id: userId },
      order: [['created_at', 'DESC']],
    });
    // Use .bind(this) or arrow function if using this._toDTO inside map
    return records.map(record => this._toDTO(record));
  },

  /** Finds all bookings in the system, ordered by most recent. Used by Admin. */
  async findAll() {
    const records = await Booking.findAll({
      order: [['created_at', 'DESC']],
    });
    return records.map(record => this._toDTO(record));
  },

  /** Creates a new booking. */
  async create(data, options = {}) {
    const record = await Booking.create(data, options);
    return this._toDTO(record);
  },

  /** Updates a booking record. */
  async update(id, data, options = {}) {
    const [affectedCount] = await Booking.update(data, {
      where: { id },
      ...options
    });
    if (affectedCount === 0) return null;
    const updated = await Booking.findByPk(id);
    return this._toDTO(updated);
  },

  /** Deletes a booking record. */
  async delete(id, options = {}) {
    return await Booking.destroy({
      where: { id },
      ...options
    });
  }
};

module.exports = BookingRepository;
