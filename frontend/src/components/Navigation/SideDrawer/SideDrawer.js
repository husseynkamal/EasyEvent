import React, { Fragment, useContext } from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { authContext } from "../../../shared/context/auth-context";
import Backdrop from "../../../shared/components/UI/Modal/Backdrop/Backdrop";

import "./SideDrawer.css";

const SideDrawer = (props) => {
  const { isLoggedIn } = useContext(authContext);

  const backdropElement = document.getElementById("backdrop-hook");
  const sideDrawerElement = document.getElementById("sidedrawer-hook");

  return (
    <Fragment>
      {props.open &&
        ReactDOM.createPortal(
          <Backdrop onCancel={props.onClose} />,
          backdropElement
        )}
      {ReactDOM.createPortal(
        <CSSTransition
          in={props.open}
          timeout={200}
          mountOnEnter
          unmountOnExit
          classNames="open">
          <nav className="side__drawer">
            <ul>
              {!isLoggedIn && (
                <li onClick={props.onClose}>
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}
              <li onClick={props.onClose}>
                <NavLink to="/events">Events</NavLink>
              </li>
              {isLoggedIn && (
                <Fragment>
                  <li onClick={props.onClose}>
                    <NavLink to="/bookings">Bookings</NavLink>
                  </li>
                  <li onClick={props.onClose}>
                    <button onClick={props.logoutHandler}>Logout</button>
                  </li>
                </Fragment>
              )}
            </ul>
          </nav>
        </CSSTransition>,
        sideDrawerElement
      )}
    </Fragment>
  );
};

export default SideDrawer;
