import React, { Fragment, useContext } from "react";
import { useHttp } from "../../../shared/hooks/use-http";

import { authContext } from "../../../shared/context/auth-context";
import LoadingSpinner from "../../../shared/components/UI/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../../shared/components/UI/ErrorMessage/ErrorMessage";

import "./BookingItem.css";

const BookingItem = ({ booking, setBooking }) => {
  const { token } = useContext(authContext);

  const { error, isLoading, sendRequest } = useHttp();

  const cancelBookingHandler = async (bookingId) => {
    const requestBody = {
      query: `
        mutation CancelBooking($id: ID!) {
          cancelBooking(bookingId: $id) {
            _id
            title
          }
        }
      `,
      variables: { id: bookingId },
    };

    setBooking((prevBooking) =>
      prevBooking.filter((booking) => booking._id !== bookingId)
    );
    try {
      await sendRequest(JSON.stringify(requestBody), {
        Authorization: "Bearer " + token,
      });
    } catch (err) {}
  };

  return (
    <Fragment>
      {isLoading && !error && <LoadingSpinner />}
      {!isLoading && error && <ErrorMessage error={error} />}
      {!isLoading && !error && (
        <li key={booking._id} className="booking__item">
          <div className="booking__item-data">
            {booking.event.title} -{" "}
            {new Date(booking.createdAt).toLocaleDateString()}
          </div>
          <div className="booking__item-actions">
            <button
              className="btn"
              onClick={cancelBookingHandler.bind(null, booking._id)}>
              Cancel
            </button>
          </div>
        </li>
      )}
    </Fragment>
  );
};

export default BookingItem;
