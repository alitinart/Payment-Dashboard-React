import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";

import "./Auth.css";
import authGuard from "../../functions/authGuard";

export default function Auth() {
  const { type } = useParams();
  const nav = useNavigate();

  React.useEffect(() => {
    const authStatus: boolean = authGuard();
    if (authStatus) {
      nav("/");
    }
    return () => {};
  }, []);

  return (
    <>
      {type === "login" ? (
        <Login></Login>
      ) : type === "register" ? (
        <Register></Register>
      ) : (
        <div className="404"></div>
      )}
    </>
  );
}
