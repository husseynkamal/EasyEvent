import React, { useCallback, useState } from "react";

import { authContext } from "./auth-context";

const AuthProvider = (props) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((userData, experation) => {
    const { userId, token } = userData.data.login || userData.data.createUser;
    const expirationDate =
      experation || new Date(new Date().getTime() + 1000 * 60 * 60);

    setToken(token);
    setUserId(userId);
    setIsLoggedIn(!!token);
    setTokenExpirationDate(expirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        token: token,
        expirationDate: expirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUserId(null);
    setToken(null);
    localStorage.removeItem("userData");
  }, []);

  const authContextValues = {
    token,
    userId,
    isLoggedIn,
    tokenExpirationDate,
    login,
    logout,
  };

  return (
    <authContext.Provider value={authContextValues}>
      {props.children}
    </authContext.Provider>
  );
};

export default AuthProvider;
