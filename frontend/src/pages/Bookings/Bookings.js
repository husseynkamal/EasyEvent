import React, { Fragment, useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useHttp } from "../../shared/hooks/use-http";

import { authContext } from "../../shared/context/auth-context";
import LoadingSpinner from "../../shared/components/UI/LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../../shared/components/UI/ErrorMessage/ErrorMessage";
import BookingLists from "../../components/Bookings/BookingsList/BookingsList";
import BookingsChart from "../../components/Bookings/BookingsChart/BookingsChart";

import "./Bookings.css";
import BookingsControls from "../../components/Bookings/BookingsControls/BookingsControls";

const Bookings = () => {
  const [bookings, setBooking] = useState([]);
  const [outputType, setOutputType] = useState("list");

  const { token } = useContext(authContext);
  const { error, isLoading, sendRequest } = useHttp();

  useEffect(() => {
    const fetchBookings = async () => {
      const requestBody = {
        query: `
          query {
            bookings {
              _id
              createdAt
              event {
                _id
                title
                date
                price
              }
            }
          }
        `,
      };

      try {
        const responseData = await sendRequest(JSON.stringify(requestBody), {
          Authorization: "Bearer " + token,
        });
        setBooking(responseData.data.bookings);
      } catch (err) {}
    };

    fetchBookings();
  }, [sendRequest, token]);

  const changeOutputTypeHandler = (outputTypeParam) => {
    if (outputTypeParam === "list") {
      setOutputType("list");
    } else {
      setOutputType("chart");
    }
  };

  const isNoBookings = bookings.length === 0;

  const content = (
    <Fragment>
      <BookingsControls
        activeOutputType={outputType}
        onClick={changeOutputTypeHandler}
      />
      <div>
        {outputType === "list" ? (
          <BookingLists bookings={bookings} setBooking={setBooking} />
        ) : (
          <BookingsChart bookings={bookings} />
        )}
      </div>
    </Fragment>
  );

  return (
    <Fragment>
      {isLoading && !error && <LoadingSpinner />}
      {!isLoading && error && <ErrorMessage error={error} />}
      {isNoBookings && !isLoading && !error && (
        <div className="empty__bookings">
          <h2>
            Press this <Link to="/events">Link</Link> to start booking.
          </h2>
        </div>
      )}
      {!isNoBookings && !isLoading && !error && content}
    </Fragment>
  );
};

export default Bookings;
