import React, { Fragment, useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useScreen } from "../../shared/hooks/use-screen";

import { authContext } from "../../shared/context/auth-context";
import DrawerToggleBtn from "./SideDrawer/DrawerToggleBtn";
import SideDrawer from "./SideDrawer/SideDrawer";
import Logo from "../../assets/Logo.png";

import "./MainNavigation.css";

const MainNavigation = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useContext(authContext);
  const [show, setShow] = useState(false);
  const { screen } = useScreen();

  const showSideDrawerHandler = () => {
    document.body.style.overflowY = "hidden";
    setShow(true);
  };

  const closeSideDrawerHandler = () => {
    document.body.style.overflowY = "initial";
    setShow(false);
  };

  const logoutHandler = () => {
    navigate("/", { replace: true });
    logout();
  };

  useEffect(() => {
    if (screen >= 767 && show) {
      closeSideDrawerHandler();
    }
  }, [screen, show]);

  return (
    <header className="main-navigation">
      <SideDrawer
        onClose={closeSideDrawerHandler}
        open={show}
        logoutHandler={logoutHandler}
      />
      <div>
        <DrawerToggleBtn onOpen={showSideDrawerHandler} />
      </div>
      <div className="main-navigation__logo">
        <img src={Logo} alt="EasyEvent Logo" />
      </div>
      <nav className="main-navigation__items">
        <ul>
          {!isLoggedIn && (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {isLoggedIn && (
            <Fragment>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            </Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
