import { createContext } from "react";

export const authContext = createContext({
  token: null,
  userId: null,
  isLoggedIn: false,
  login: (userData) => {},
  logout: () => {},
});
