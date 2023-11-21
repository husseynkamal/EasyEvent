import React from "react";

import BookingItem from "../BookingItem/BookingItem";

import "./BookingsList.css";

const BookingList = ({ bookings, setBooking }) => {
  const insertedBookings = bookings.map((booking) => {
    return (
      <BookingItem
        key={booking._id}
        booking={booking}
        setBooking={setBooking}
      />
    );
  });
  return <ul className="bookings__list">{insertedBookings}</ul>;
};

export default BookingList;
