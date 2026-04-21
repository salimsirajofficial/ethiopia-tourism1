const express = require('express');
const adminController = require('./admin.controller');
const verifyToken = require('../../../shared/middleware/authMiddleware');

const router = express.Router();

// All admin routes are protected by verifyToken.
// In a full implementation, an `isAdmin` middleware would also be used here.

/**
 * GET /api/admin/bookings
 * Fetches all bookings system-wide.
 */
router.get('/bookings', verifyToken, adminController.getAllBookings);

/**
 * PATCH /api/admin/bookings/:id/status
 * Updates the approval status of a booking.
 */
router.patch('/bookings/:id/status', verifyToken, adminController.updateBookingStatus);

module.exports = router;
