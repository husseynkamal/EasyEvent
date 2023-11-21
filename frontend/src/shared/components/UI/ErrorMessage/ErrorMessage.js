import React from "react";

import "./ErrorMessage.css";

const ErrorMessage = ({ error }) => {
  return <div className="error-message">{error}</div>;
};

export default ErrorMessage;
