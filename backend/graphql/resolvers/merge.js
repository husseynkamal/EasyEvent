const Event = require("../../models/event");
const User = require("../../models/user");

const { dateToString } = require("../../helpers/date");

const singleEvent = async (eventId) => {
  let existingEvent;
  try {
    existingEvent = await Event.findById(eventId);
  } catch (err) {
    throw err;
  }

  return existingEvent;
};

const events = async (eventIds) => {
  let events;
  try {
    events = await Event.find({ _id: { $in: eventIds } });
    events.sort((a, b) => {
      return (
        eventIds.indexOf(a._id.toString()) - eventIds.indexOf(b._id.toString())
      );
    });
  } catch (err) {
    throw err;
  }

  return events.map((event) => transformEvent(event));
};

const user = async (userId) => {
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    throw err;
  }

  return {
    ...user._doc,
    password: null,
    createdEvents: events.bind(this, user._doc.createdEvents),
  };
};

const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
};

const transformBooking = (booking) => {
  return {
    ...booking._doc,
    event: singleEvent.bind(this, booking._doc.event),
    user: user.bind(this, booking._doc.user),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
