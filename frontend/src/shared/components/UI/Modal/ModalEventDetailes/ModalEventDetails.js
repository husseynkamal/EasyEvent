import React from "react";

import "./ModalEventDetails.css";

const ModalEventDetails = ({ events, eventId }) => {
  const eventItem = events.find((event) => event._id === eventId);

  return (
    <div className="modal__details">
      <h1>
        Title: <span>{eventItem.title}</span>
      </h1>
      <p>
        Price: <span>${eventItem.price}</span>
      </p>
      <p>
        Date: <span>{new Date(eventItem.date).toLocaleDateString()}</span>
      </p>
      <p>
        Description: <span>{eventItem.description}</span>
      </p>
    </div>
  );
};

export default ModalEventDetails;
