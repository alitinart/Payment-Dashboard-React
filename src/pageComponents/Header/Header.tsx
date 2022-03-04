import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/images/Logo.png";

import "./Header.css";

export default function Header() {
  const nav = useNavigate();

  const [menu, setMenu] = React.useState(false);

  const user = useSelector((state: { user: any }) => state.user);

  const menuHanlder = () => {
    setMenu(!menu);
  };

  return (
    <>
      <div className="header">
        <img
          className="nav-logo"
          style={{ cursor: "pointer" }}
          onClick={() => {
            nav("/");
          }}
          src={logo}
        />
        <ul className="navigation">
          {user ? (
            <>
              <Link to={""} className="nav-link">
                Dashboard
              </Link>
              <Link to={""} className="nav-link">
                Stores
              </Link>
              <Link to={""} className="nav-link">
                About Us
              </Link>
              <Link to={""} className="nav-link">
                Contact Us
              </Link>
              <Link to={""} className="nav-link nav-button">
                Account
              </Link>
            </>
          ) : (
            <>
              <Link to={""} className="nav-link">
                Home
              </Link>
              <Link to={""} onClick={menuHanlder} className="nav-link">
                About Us
              </Link>
              <Link to={""} onClick={menuHanlder} className="nav-link">
                Contact Us
              </Link>
              <Link to={"/auth/register"} className="nav-link nav-button">
                Create Account
              </Link>
              <Link to={"/auth/login"} className="nav-link nav-button">
                Login
              </Link>
            </>
          )}
        </ul>
        <i
          onClick={() => {
            setMenu(!menu);
          }}
          className={"bi " + (menu ? "bi-x" : "bi-list") + " hamburger"}
        ></i>
      </div>
      <ul className={"phone-navigation " + (menu ? "opened" : "closed")}>
        {user ? (
          <>
            <Link to={""} onClick={menuHanlder} className="nav-link">
              Dashboard
            </Link>
            <Link to={""} onClick={menuHanlder} className="nav-link">
              Stores
            </Link>
            <Link to={""} onClick={menuHanlder} className="nav-link nav-button">
              Account
            </Link>
          </>
        ) : (
          <>
            <Link to={""} onClick={menuHanlder} className="nav-link">
              Home
            </Link>
            <Link to={""} onClick={menuHanlder} className="nav-link">
              About Us
            </Link>
            <Link to={""} onClick={menuHanlder} className="nav-link">
              Contact Us
            </Link>
            <Link
              to={"/auth/register"}
              onClick={menuHanlder}
              className="nav-link nav-button"
            >
              Create Account
            </Link>
            <Link
              to={"/auth/login"}
              onClick={menuHanlder}
              className="nav-link nav-button"
            >
              Login
            </Link>
          </>
        )}
      </ul>
    </>
  );
}
