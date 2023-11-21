const Booking = require("../../models/booking");
const HttpError = require("../../error/http-error");

const { transformBooking, transformEvent } = require("./merge");

module.exports = {
  bookings: async (args, req) => {
    if (!req.isAuth) {
      const error = new HttpError("Unauthenticated.", 403);
      throw error;
    }

    let bookings;
    try {
      bookings = await Booking.find({ user: req.userId });
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    return bookings.map((booking) => {
      return transformBooking(booking);
    });
  },
  bookEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      const error = new HttpError("Unauthenticated.", 403);
      throw error;
    }

    const booking = new Booking({
      event: eventId,
      user: req.userId,
    });

    let createdBooking;
    try {
      createdBooking = await booking.save();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    return transformBooking(createdBooking);
  },
  cancelBooking: async ({ bookingId }, req) => {
    if (!req.isAuth) {
      const error = new HttpError("Unauthenticated.", 403);
      throw error;
    }
    let exisitgBooking;
    try {
      exisitgBooking = await Booking.findById(bookingId).populate("event");
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    if (!exisitgBooking) {
      const error = new HttpError("Booking not found.", 404);
      throw error;
    }

    if (req.userId !== exisitgBooking.user.toString()) {
      const error = new HttpError("Unauthorized.", 401);
      throw error;
    }

    const event = transformEvent(exisitgBooking.event);

    try {
      await Booking.findByIdAndRemove(bookingId);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    return event;
  },
};
