import React from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import "./DrawerToggleBtn.css";

const DrawerToggleBtn = ({ onOpen }) => {
  return (
    <button className="drawer__btn" onClick={onOpen}>
      <GiHamburgerMenu />
    </button>
  );
};

export default DrawerToggleBtn;
