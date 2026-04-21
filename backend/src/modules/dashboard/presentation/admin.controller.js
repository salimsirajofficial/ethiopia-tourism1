const BookingRepository = require('../infrastructure/booking.repository');
const UserRepository = require('../../auth/infrastructure/user.repository');
const logger = require('../../../shared/utils/logger');

const adminController = {
  /**
   * GET /api/admin/bookings
   * Fetches all bookings in the system for the admin dashboard.
   */
  async getAllBookings(req, res, next) {
    try {
      // In a production app, we would verify req.user has admin privileges here.
      // For this implementation, we trust the verifyToken middleware.

      const bookings = await BookingRepository.findAll();

      // We also want to fetch user details for each booking to display in the dashboard
      const bookingsWithUsers = await Promise.all(
        bookings.map(async (booking) => {
          try {
            const user = await UserRepository.findById(booking.userId);
            return {
              ...booking,
              user: user ? {
                fullName: user.fullName,
                email: user.email,
                avatarUrl: user.avatarUrl
              } : null
            };
          } catch (err) {
            return booking; // fallback if user fetch fails
          }
        })
      );

      res.status(200).json(bookingsWithUsers);
    } catch (err) {
      logger.error('Get all bookings admin error:', err.message);
      next(err);
    }
  },

  /**
   * PATCH /api/admin/bookings/:id/status
   * Updates the status of a specific booking.
   */
  async updateBookingStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: 'Status is required' });
      }

      const updated = await BookingRepository.update(id, { status });
      if (!updated) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.status(200).json(updated);
    } catch (err) {
      logger.error('Update booking status admin error:', err.message);
      next(err);
    }
  }
};

module.exports = adminController;
