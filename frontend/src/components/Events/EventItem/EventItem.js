import React, { Fragment, useContext } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useHttp } from "../../../shared/hooks/use-http";

import { authContext } from "../../../shared/context/auth-context";

import "./EventItem.css";

const EventItem = ({ event, onOpen, setEvents }) => {
  const { token, userId } = useContext(authContext);
  const { isLoading, sendRequest } = useHttp();

  const deleteEventHandler = async (eventId) => {
    const requestBody = {
      query: `
        mutation DeleteEvent($id: ID!) {
          deleteEvent(eventId: $id) {
            message
          }
        }
      `,
      variables: { id: eventId },
    };
    try {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
      await sendRequest(JSON.stringify(requestBody), {
        Authorization: "Bearer " + token,
      });
    } catch (err) {}
  };

  return (
    <Fragment>
      <li className="events__list-item">
        <div>
          <h1>{event.title}</h1>
          <h2>
            ${event.price} - {new Date(event.date).toLocaleDateString()}
          </h2>
        </div>
        <div>
          {userId === event.creator._id ? (
            <div className="update-control">
              <button
                onClick={onOpen.bind(null, event._id)}
                disabled={isLoading}>
                <FaEdit />
              </button>
              <button
                onClick={deleteEventHandler.bind(null, event._id)}
                disabled={isLoading}>
                <MdDelete />
              </button>
            </div>
          ) : (
            <button className="btn view" onClick={onOpen.bind(null, event._id)}>
              View Details
            </button>
          )}
        </div>
      </li>
    </Fragment>
  );
};

export default EventItem;
