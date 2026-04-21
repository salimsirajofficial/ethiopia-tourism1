const express         = require('express');
const dashboardController = require('./dashboard.controller');
const verifyToken     = require('../../../shared/middleware/authMiddleware');

const router = express.Router();

/**
 * GET /api/dashboard/status
 * Fetches user profile status and digital ticket summaries.
 */
router.get('/status', verifyToken, dashboardController.getStatus);

/**
 * POST /api/dashboard/bookings
 * Create a new travel ticket.
 */
router.post('/bookings', verifyToken, dashboardController.create);

/**
 * PATCH /api/dashboard/bookings/:id/cancel
 * Cancels a specific travel ticket.
 */
router.patch('/bookings/:id/cancel', verifyToken, dashboardController.cancel);

/**
 * DELETE /api/dashboard/bookings/:id
 * Removes a travel ticket.
 */
router.delete('/bookings/:id', verifyToken, dashboardController.delete);

module.exports = router;
