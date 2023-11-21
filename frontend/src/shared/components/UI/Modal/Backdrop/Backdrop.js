import React from "react";

import "./Backdrop.css";

const Backdrop = ({ onCancel }) => {
  return <div className="backdrop" onClick={onCancel} />;
};

export default Backdrop;
