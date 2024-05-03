import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import logoImage from "../assets/download.png";
import LogoHambburger from "../assets/hamburger.svg";
import LogoCLose from "../assets/close-circle.svg";
import './SideBar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open shadow-lg' : ''}`}>
      {/* <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
      </button> */}
      <img
        src={LogoHambburger}
        alt="Logo"
        className={`${isOpen ? 'hidden' : 'toggle-btn'}`}
        onClick={toggleSidebar}
      />
      <div className="sidebar-header">
      <img
              src={logoImage}
              alt="Logo AsNodt"
              className="logo-header"
            />
        <img
          src={LogoCLose}
          alt="Logo"
          className="logo-close"
          onClick={toggleSidebar}
        />

      </div>
      <ul>
        <li>
          <Link
            className={`${useLocation().pathname === "/"
                ? "text-primary-green"
                : "text-gray-500"
              } "no-underline p-3 text-sm font-bold "`}
            aria-current="page"
            to={"/"}
          >
            Swap
          </Link>
        </li>
        <li>
          <Link
            className={`${useLocation().pathname === "/liquidity"
                ? "text-primary-green"
                : "text-gray-500"
              } "no-underline p-3 text-sm font-bold "`}
            aria-current="page"
            to={"/liquidity"}
          >
            Liquidity
          </Link>
        </li>
        <li>
         
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
