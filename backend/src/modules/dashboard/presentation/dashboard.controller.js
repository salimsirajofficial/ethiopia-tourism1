const getDashboardStatus = require('../application/getDashboardStatus');
const createBooking      = require('../application/createBooking');
const BookingRepository  = require('../infrastructure/booking.repository');
const logger              = require('../../../shared/utils/logger');

const dashboardController = {
  /**
   * GET /api/dashboard/status
   * Fetches the user's travel statuses and ticket data.
   */
  async getStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const dashboardData = await getDashboardStatus(userId);
      res.status(200).json(dashboardData);
    } catch (err) {
      logger.error('Dashboard status error:', err.message);
      next(err);
    }
  },

  /**
   * POST /api/dashboard/bookings
   * Creates a new booking for the authenticated user.
   */
  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const { destinationCode, travelClass, travelDate, returnDate, guests, phone, passportId, specialRequests } = req.body;
      
      const newBooking = await createBooking(userId, { 
        destinationCode, 
        travelClass,
        travelDate,
        returnDate,
        guests,
        phone,
        passportId,
        specialRequests
      });
      res.status(201).json(newBooking);
    } catch (err) {
      logger.error('Create booking error:', err.message);
      next(err);
    }
  },

  /**
   * PATCH /api/dashboard/bookings/:id/cancel
   * Cancels a specific booking.
   */
  async cancel(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verify ownership
      const bookings = await BookingRepository.findAllByUserId(userId);
      const booking = bookings.find(b => b.id === id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found or unauthorized' });
      }

      const updated = await BookingRepository.update(id, { status: 'cancelled' });
      res.status(200).json(updated);
    } catch (err) {
      logger.error('Cancel booking error:', err.message);
      next(err);
    }
  },

  /**
   * DELETE /api/dashboard/bookings/:id
   * Removes a booking record.
   */
  async delete(req, res, next) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Verify ownership
      const bookings = await BookingRepository.findAllByUserId(userId);
      const booking = bookings.find(b => b.id === id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found or unauthorized' });
      }

      await BookingRepository.delete(id);
      res.status(200).json({ message: 'Booking deleted successfully' });
    } catch (err) {
      logger.error('Delete booking error:', err.message);
      next(err);
    }
  }
};

module.exports = dashboardController;
