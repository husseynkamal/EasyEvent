import React, { Fragment } from "react";
import ReactDOM from "react-dom";

import Backdrop from "./Backdrop/Backdrop";
import ModalContent from "./ModalContent/ModalContent";
import ModalEventDetails from "./ModalEventDetailes/ModalEventDetails";
import ModalForm from "./ModalForm/ModalForm";

const Modal = (props) => {
  const {
    title,
    events,
    isValid,
    eventId,
    opening,
    isLoading,
    isViewDetails,
    initialFormValues,
    onBook,
    onCancel,
    onConfirm,
    inputHandler,
  } = props;

  const backdropElement = document.getElementById("backdrop-hook");
  const modalContentElement = document.getElementById("modal-hook");

  return (
    <Fragment>
      {opening &&
        ReactDOM.createPortal(
          <Backdrop onCancel={onCancel} />,
          backdropElement
        )}
      {ReactDOM.createPortal(
        <ModalContent
          title={title}
          show={opening}
          isValid={isValid}
          isLoading={isLoading}
          isViewDetails={isViewDetails}
          onCancel={onCancel}
          onConfirm={onConfirm}
          onBook={onBook}>
          {!isViewDetails ? (
            <ModalForm
              initialFormValues={initialFormValues}
              inputHandler={inputHandler}
            />
          ) : (
            <ModalEventDetails events={events} eventId={eventId} />
          )}
        </ModalContent>,
        modalContentElement
      )}
    </Fragment>
  );
};

export default Modal;
