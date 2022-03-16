import { stat } from "fs";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import logo from "../../assets/images/Logo.png";
import NotificationProvider from "../../functions/notificationProvider";
import { userRequests } from "../../functions/requests";
import { State } from "../../models/stateModel";

import "./Header.css";

export default function Header() {
  const nav = useNavigate();

  const [menu, setMenu] = React.useState(false);

  const dispatch = useDispatch();

  const { user, token, refreshId } = useSelector((state: State) => state);

  const menuHanlder = () => {
    setMenu(!menu);
  };

  const logoutHandler = async () => {
    const resData = await userRequests.logout(refreshId, token);

    if (resData.error) {
      return NotificationProvider("Error", resData.message, "danger");
    }

    dispatch({
      type: "logout",
    });

    localStorage.removeItem("token");
    localStorage.removeItem("refreshId");

    NotificationProvider("Successfully Logged Out", resData.message, "success");
    nav("/auth/login");
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
                Home
              </Link>
              <Link to={"/stores"} className="nav-link">
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
              <button
                onClick={logoutHandler}
                className="nav-link btn btn-white"
              >
                Logout
              </button>
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
              Home
            </Link>
            <Link to={"/stores"} onClick={menuHanlder} className="nav-link">
              Stores
            </Link>
            <Link to={""} onClick={menuHanlder} className="nav-link nav-button">
              Account
            </Link>
            <button
              onClick={logoutHandler}
              className="nav-link btn btn-white nav-button"
            >
              Logout
            </button>
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
