const bcrypt = require('bcrypt');
const sequelize = require('../../shared/db/sequelize');
const UserRepository = require('../auth/infrastructure/user.repository');
const BookingRepository = require('../dashboard/infrastructure/booking.repository');
const JwtService = require('../auth/infrastructure/jwt.service');
const logger = require('../../shared/utils/logger');

/**
 * Atomic Checkout Logic
 * POST /api/checkout
 */
const processCheckout = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Handle FormData where body might be nested in 'data' string or just flat
    const body = req.body;
    const {
      name, email, phone, password,
      destinationCode, travelDate, returnDate, travelClass
    } = body;

    // Parse numeric fields (Multer makes everything a string)
    const guests = parseInt(body.guests) || 1;

    // Extract file paths from req.files
    const avatarPath = req.files?.['avatar']?.[0]?.filename ? `/uploads/${req.files['avatar'][0].filename}` : null;
    const passportPath = req.files?.['passport']?.[0]?.filename ? `/uploads/${req.files['passport'][0].filename}` : null;

    let userId = req.user?.id;
    let token = null;
    let userResponse = null;

    // 1. Handle User Creation if not logged in
    if (!userId) {
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required for new accounts.' });
      }

      // Check if user exists
      const existingUser = await UserRepository.findByEmailOrUsername(email, email);
      if (existingUser) {
        await transaction.rollback();
        return res.status(400).json({ message: 'An account with this email already exists. Please log in.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create User (Atomic within transaction)
      const newUser = await UserRepository.create({
        full_name: name,
        username: email.split('@')[0] + Math.floor(Math.random() * 1000), // Generate unique username
        email,
        password: hashedPassword,
        avatar_url: avatarPath,
        passport_image_url: passportPath,
        status: 'approved'
      }, { transaction });

      userId = newUser.id;
      userResponse = {
        id: newUser.id,
        name: newUser.fullName,
        email: newUser.email
      };

      // Generate JWT
      token = JwtService.sign({
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
      });
    }

    // 2. Create Booking
    const tourId = `ETH-${destinationCode.toUpperCase()}-${Math.floor(Math.random() * 10000)}`;

    const booking = await BookingRepository.create({
      user_id: userId,
      destination_code: destinationCode,
      tour_id: tourId,
      travel_class: travelClass || 'economy',
      departure_date: travelDate,
      return_date: returnDate,
      guests: guests || 1,
      status: 'pending'
    }, { transaction });

    // 3. Commit Transaction
    await transaction.commit();

    logger.info(`Checkout successful for User ${userId}. Booking ${booking.id} created.`);

    return res.status(201).json({
      message: 'Checkout successful',
      token, // Return token if new user was created
      user: userResponse,
      booking: {
        id: booking.id,
        networkId: booking.network_id,
        issueHash: booking.issue_hash
      }
    });

  } catch (error) {
    // 4. Rollback on any failure
    if (transaction) await transaction.rollback();

    logger.error('Checkout failed:', error);
    return res.status(500).json({
      message: 'Checkout failed. Please try again.',
      error: error.message
    });
  }
};

module.exports = {
  processCheckout
};
