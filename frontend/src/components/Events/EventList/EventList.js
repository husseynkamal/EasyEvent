import React from "react";

import EventItem from "../EventItem/EventItem";
import ErrorMessage from "../../../shared/components/UI/ErrorMessage/ErrorMessage";
import LoadingSpinner from "../../../shared/components/UI/LoadingSpinner/LoadingSpinner";

import "./EventList.css";

const EventList = (props) => {
  const { events, isLoading, error, onOpen, setEvents } = props;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const insertedEvents = events.map((event) => (
    <EventItem
      key={event._id}
      event={event}
      onOpen={onOpen}
      setEvents={setEvents}
    />
  ));

  return (
    <ul className="event__list">
      {!isLoading && error && <ErrorMessage error={error} />}
      {insertedEvents}
    </ul>
  );
};

export default EventList;
