import React, { Fragment, useContext } from "react";
import { CSSTransition } from "react-transition-group";

import { authContext } from "../../../../context/auth-context";

import "./ModalContent.css";

const ModalContent = (props) => {
  const { isLoggedIn } = useContext(authContext);

  return (
    <CSSTransition
      in={props.show}
      timeout={200}
      mountOnEnter
      unmountOnExit
      classNames="show">
      <div className="modal-content">
        <header className="modal-content__header">
          <h1>{props.title}</h1>
        </header>
        <section className="modal-content__content">{props.children}</section>
        <section className="modal-content__actions">
          <button className="btn" onClick={props.onCancel}>
            Cancel
          </button>
          <Fragment>
            {!props.isViewDetails && (
              <button
                className="btn"
                onClick={props.onConfirm}
                disabled={!props.isValid || props.isLoading}>
                Confirm
              </button>
            )}
            {props.isViewDetails && isLoggedIn && (
              <button
                className="btn"
                onClick={props.onBook}
                disabled={props.isLoading}>
                Book
              </button>
            )}
          </Fragment>
        </section>
      </div>
    </CSSTransition>
  );
};

export default ModalContent;
