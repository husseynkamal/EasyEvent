import React from "react";

import "./BookingsControls.css";

const BookingsControls = ({ activeOutputType, onClick }) => {
  return (
    <div className="bookings-control">
      <button
        className={activeOutputType === "list" ? "active" : ""}
        onClick={onClick.bind(null, "list")}>
        List
      </button>
      <button
        className={activeOutputType === "chart" ? "active" : ""}
        onClick={onClick.bind(null, "chart")}>
        Chart
      </button>
    </div>
  );
};

export default BookingsControls;
