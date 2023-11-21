const mongoose = require("mongoose");
const validator = require("validator");

const User = require("../../models/user");
const Event = require("../../models/event");
const HttpError = require("../../error/http-error");

const { transformEvent } = require("./merge");
const Booking = require("../../models/booking");

const isEventExists = async (eventId) => {
  let existiningEvent;
  try {
    existiningEvent = await Event.findById(eventId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, please try again later.",
      500
    );
    throw error;
  }

  if (!existiningEvent) {
    const error = new HttpError("Event not found.", 404);
    throw error;
  }

  return existiningEvent;
};

const validateEvent = (eventInput) => {
  const errors = [];
  if (
    validator.isEmpty(eventInput.title) ||
    !validator.isDate(new Date(eventInput.date)) ||
    !validator.isFloat(eventInput.price.toString()) ||
    eventInput.price < 50
  ) {
    errors.push({ message: "Invalid inputs, please check your data." });
  }
  if (
    validator.isEmpty(eventInput.description) ||
    !validator.isLength(eventInput.description, { min: 6 })
  ) {
    errors.push({ message: "Invalid inputs, please check your data." });
  }

  return errors;
};

module.exports = {
  events: async () => {
    let events;
    try {
      events = await Event.find();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    return events.map((event) => {
      return transformEvent(event);
    });
  },
  createEvent: async ({ eventInput }, req) => {
    if (!req.isAuth) {
      const error = new HttpError("Unauthenticated.", 403);
      throw error;
    }

    const errors = validateEvent(eventInput);
    if (errors.length > 0) {
      const error = new HttpError(
        "Invalid inputs, please check your data.",
        422
      );
      throw error;
    }

    const event = {
      ...eventInput,
      date: new Date(eventInput.date),
    };

    const createdEvent = new Event({
      ...event,
      creator: req.userId,
    });

    let eventResult;
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();

      eventResult = await createdEvent.save({ session: sess });
      await User.updateOne(
        { _id: req.userId },
        { $push: { createdEvents: createdEvent._id } },
        { session: sess }
      );

      await sess.commitTransaction();
      sess.endSession();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    return transformEvent(eventResult);
  },
  updateEvent: async ({ eventInput, eventId }, req) => {
    if (!req.isAuth) {
      const error = new HttpError("Unauthenticated.", 403);
      throw error;
    }

    const errors = validateEvent(eventInput);
    if (errors.length > 0) {
      const error = new HttpError(errors[0].message, 422);
      throw error;
    }

    let existiningEvent;
    try {
      existiningEvent = await isEventExists(eventId);
    } catch (err) {
      throw err;
    }

    if (req.userId !== existiningEvent.creator.toString()) {
      const error = new HttpError("Unauthorized", 401);
      throw error;
    }

    existiningEvent.title = eventInput.title;
    existiningEvent.description = eventInput.description;
    existiningEvent.date = new Date(eventInput.date);
    existiningEvent.price = eventInput.price;

    try {
      await existiningEvent.save();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    return transformEvent(existiningEvent);
  },
  deleteEvent: async ({ eventId }, req) => {
    if (!req.isAuth) {
      const error = new HttpError("Unauthenticated.", 403);
      throw error;
    }

    let existiningEvent;
    try {
      existiningEvent = await isEventExists(eventId);
    } catch (err) {
      throw err;
    }

    if (req.userId !== existiningEvent.creator.toString()) {
      const error = new HttpError("Unauthorized", 401);
      throw error;
    }

    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();

      await Event.findByIdAndDelete(eventId, { session: sess });
      await Booking.deleteMany(
        { event: existiningEvent._id },
        { session: sess }
      );
      await User.updateOne(
        { _id: req.userId },
        { $pull: { createdEvents: existiningEvent._id } },
        { session: sess }
      );

      await sess.commitTransaction();
      sess.endSession();
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, please try again later.",
        500
      );
      throw error;
    }

    return { message: "Event deleted." };
  },
};
