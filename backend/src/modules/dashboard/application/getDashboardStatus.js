const BookingRepository = require('../infrastructure/booking.repository');
const UserRepository = require('../../auth/infrastructure/user.repository');

/**
 * APPLICATION LAYER — Dashboard Module
 * Use-case: Retrieve comprehensive traveler status and digital ticket data.
 */
const getDashboardStatus = async (userId) => {
  // 1. Fetch user to get their status and level
  const user = await UserRepository.findById(userId);
  if (!user) throw { status: 404, message: 'User not found' };

  // 2. Fetch all their bookings
  const bookings = await BookingRepository.findAllByUserId(userId);
  
  // 3. Return as a clean DTO
  return {
    user: {
      id:               user.id,
      name:             user.fullName,
      email:            user.email,
      status:           user.status,
      explorerLevel:    user.explorerLevel,
      avatarUrl:        user.avatarUrl,
      nationalIdNumber: user.nationalIdNumber,
      passportNumber:   user.passportNumber,
      phoneNumber:      user.phoneNumber,
    },
    bookings: bookings, // List of all tickets
  };
};

module.exports = getDashboardStatus;
