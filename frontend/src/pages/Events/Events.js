import React, { Fragment, useContext, useEffect, useState } from "react";
import { useHttp } from "../../shared/hooks/use-http";
import { useForm } from "../../shared/hooks/use-form";

import { authContext } from "../../shared/context/auth-context";

import Modal from "../../shared/components/UI/Modal/Modal";
import EventList from "../../components/Events/EventList/EventList";

import "./Events.css";

const Events = () => {
  const { isLoggedIn, token } = useContext(authContext);

  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("Add Event");
  const [isDetails, setIsDetails] = useState(false);
  const [isUpdateMode, setUpdateMode] = useState(false);

  const { error, isLoading, sendRequest } = useHttp();
  const { formState, inputHandler, setFormData } = useForm(
    {
      title: { value: "", isValid: false },
      price: { value: "", isValid: false },
      date: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );

  useEffect(() => {
    const fetchEvents = async () => {
      const requestBody = {
        query: `
          query {
            events {
              _id
              title
              description
              price
              date
              creator {
                _id
                email
              }
            }
          }
        `,
      };
      try {
        const responseData = await sendRequest(JSON.stringify(requestBody));
        setEvents(responseData.data.events);
      } catch (err) {}
    };

    fetchEvents();
  }, [sendRequest]);

  const startCreateEventHandler = (eventId, e) => {
    if (e.target.classList.contains("view")) {
      setCreating(true);
      setIsDetails(true);
      setEventId(eventId);
      return;
    }

    if (eventId) {
      const existiningEvent = events.find((event) => event._id === eventId);
      setFormData(
        {
          title: { value: existiningEvent.title, isValid: true },
          price: { value: existiningEvent.price, isValid: true },
          date: { value: existiningEvent.date.slice(0, 16), isValid: true },
          description: { value: existiningEvent.description, isValid: true },
        },
        true
      );
      setUpdateMode(true);
      setEventId(eventId);
    } else {
      setFormData(
        {
          title: { value: "", isValid: false },
          price: { value: "", isValid: false },
          date: { value: "", isValid: false },
          description: { value: "", isValid: false },
        },
        false
      );

      setUpdateMode(false);
      setEventId(null);
    }
    setCreating(true);
  };

  const cancelCreateEventHandler = () => {
    setCreating(false);
    setUpdateMode(false);
    setIsDetails(false);
  };

  const confirmEventHandler = async () => {
    const event = {};
    for (const input of Object.keys(formState.inputs)) {
      const eventValue = formState.inputs[input].value;
      event[input] = input === "price" ? +eventValue : eventValue;
    }

    const variables = {
      ...event,
      id: eventId,
    };

    let requestBody;
    if (isUpdateMode) {
      requestBody = {
        query: `
        mutation UpdateEvent($title: String!, $price: Float!, $date: String!, $description: String!, $id: ID!) {
          updateEvent(eventInput: 
            {
              title: $title, 
              price: $price, 
              date: $date,
              description: $description
            }, eventId: $id) {
              _id
              title
              description
              date
              price
              creator {
                _id
              }
            }
          }
        `,
        variables: variables,
      };
    } else {
      requestBody = {
        query: `
          mutation CreateEvent($title: String!, $price: Float!, $description: String!, $date: String!) {
            createEvent(eventInput: {
              title: $title, 
              price: $price, 
              description: $description,
              date: $date
            }) {
              _id
              title
              description
              date
              price
              creator {
                _id
              }
            }
          }
        `,
        variables: event,
      };
    }

    try {
      const newEvent = await sendRequest(JSON.stringify(requestBody), {
        Authorization: "Bearer " + token,
      });

      if (isUpdateMode) {
        setEvents((prevEvents) => {
          const existiningEventIndex = prevEvents.findIndex(
            (event) => event._id === newEvent.data.updateEvent._id
          );

          const updatedEvents = [...prevEvents];
          updatedEvents[existiningEventIndex] = newEvent.data.updateEvent;
          return updatedEvents;
        });
      } else {
        setEvents((prevEvents) => [...prevEvents, newEvent.data.createEvent]);
      }
      cancelCreateEventHandler();
    } catch (err) {
      cancelCreateEventHandler();
    }
  };

  const bookEventHandler = async () => {
    const requestBody = {
      query: `
        mutation BookEvent($id: ID!) {
          bookEvent(eventId: $id) {
            _id
            createdAt
            updatedAt
          }
        }
      `,
      variables: {
        id: eventId,
      },
    };

    try {
      await sendRequest(JSON.stringify(requestBody), {
        Authorization: "Bearer " + token,
      });
      cancelCreateEventHandler();
    } catch (err) {
      cancelCreateEventHandler();
    }
  };

  useEffect(() => {
    if (isUpdateMode) {
      setTitle("Update Event");
    } else if (isDetails) {
      setTitle("Event Details");
    }
  }, [isUpdateMode, isDetails]);

  return (
    <Fragment>
      <Modal
        title={title}
        events={events}
        eventId={eventId}
        opening={creating}
        isLoading={isLoading}
        isViewDetails={isDetails}
        isValid={formState.isValid}
        initialFormValues={formState}
        onBook={bookEventHandler}
        inputHandler={inputHandler}
        onConfirm={confirmEventHandler}
        onCancel={cancelCreateEventHandler}
      />
      {isLoggedIn && (
        <div className="events-control">
          <p>Share your own Events!</p>
          <button
            className="btn"
            onClick={startCreateEventHandler.bind(null, null)}>
            Create Event
          </button>
        </div>
      )}
      <EventList
        events={events}
        isLoading={isLoading}
        error={error}
        onOpen={startCreateEventHandler}
        setEvents={setEvents}
      />
    </Fragment>
  );
};

export default Events;
