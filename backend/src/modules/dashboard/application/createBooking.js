const BookingRepository = require('../infrastructure/booking.repository');

/**
 * APPLICATION LAYER — Dashboard Module
 * Use-case: Create a new travel booking.
 */
const createBooking = async (userId, { destinationCode, travelClass, travelDate, returnDate, guests, phone, passportId, specialRequests }) => {
  // Generating a tourId for example purposes
  const tourId = `ETH-${destinationCode.toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

  const newBooking = await BookingRepository.create({
    user_id: userId,
    destination_code: destinationCode,
    tour_id: tourId,
    phone: phone,
    passport_id: passportId,
    special_requests: specialRequests,
    travel_class: travelClass || 'economy',
    departure_date: travelDate,
    return_date: returnDate,
    guests: guests || 1,
    status: 'pending',
  });

  return newBooking;
};

module.exports = createBooking;
