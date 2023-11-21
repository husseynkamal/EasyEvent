import React, { Fragment, useContext, useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";

import { authContext } from "./shared/context/auth-context";

import MainNavigation from "./components/Navigation/MainNavigation";
import Auth from "./pages/Auth/Auth";
import Bookings from "./pages/Bookings/Bookings";
import Events from "./pages/Events/Events";
import NotFound from "./pages/NotFound/NotFound";

let logoutTimer;

const App = () => {
  const navigate = useNavigate();
  const { isLoggedIn, tokenExpirationDate, token, login, logout } =
    useContext(authContext);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (storedData?.token && new Date(storedData.expirationDate) > new Date()) {
      const userData = {
        data: { login: { token: storedData.token, userId: storedData.userId } },
      };
      login(userData, new Date(storedData.expirationDate));
    } else {
      logout();
    }
  }, [login, logout]);

  useEffect(() => {
    if (tokenExpirationDate && token) {
      const reminingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, reminingTime);
      navigate("/", { replace: true });
    } else {
      clearTimeout(logoutTimer);
    }
    // eslint-disable-next-line
  }, [token, tokenExpirationDate, logout]);

  let routes;
  if (!isLoggedIn) {
    routes = (
      <Fragment>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/events" element={<Events />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Fragment>
    );
  } else {
    routes = (
      <Fragment>
        <Route path="/" element={<Navigate to="/events" />} />
        <Route path="/events" element={<Events />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="*" element={<NotFound />} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <MainNavigation />
      <main className="main-content">
        <Routes>{routes}</Routes>
      </main>
    </Fragment>
  );
};

export default App;
