import * as React from "react";
import { useNavigate } from "react-router-dom";
import authGuard from "../../../functions/authGuard";
import NotificationProvider from "../../../functions/notificationProvider";
import { userRequests } from "../../../functions/requests";

export default function Register() {
  const [submit, setSubmit] = React.useState(false);

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [role, setRole] = React.useState("");
  const [storeName, setStoreName] = React.useState("");
  const [storeIdentifier, setStoreIdentifier] = React.useState("");

  const nav = useNavigate();

  const submitHandler = async () => {
    if (role === "Worker") {
      const resData = await userRequests.registerWorker(
        fullName,
        password,
        role,
        email,
        storeIdentifier,
        storeName
      );
      if (resData.error) {
        setSubmit(false);
        return NotificationProvider("Error", resData.message, "danger");
      }
      nav("/auth/login");
    } else if (role === "Owner") {
      const resData = await userRequests.registerOwner(
        fullName,
        password,
        role,
        email
      );
      if (resData.error) {
        setSubmit(false);
        return NotificationProvider("Error", resData.message, "danger");
      }
      nav("/auth/login");
    } else {
      NotificationProvider("Error", "Role not defined", "danger");
    }
  };

  return (
    <div className="register">
      {!submit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmit(true);
            submitHandler();
          }}
          className={"form"}
        >
          <h1 className="title">Register</h1>
          <input
            className="form-control"
            type={"text"}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
            placeholder="Full Name"
            required
          />
          <input
            className="form-control"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type={"email"}
            placeholder="Email"
            required
          />
          <input
            className="form-control"
            type={"password"}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="Password"
            required
          />
          <select
            onChange={(e) => {
              setRole(e.target.value);
            }}
            defaultValue={"None"}
            className="form-control"
            required
          >
            <option style={{ color: "white" }} disabled value={"None"}>
              None
            </option>
            <option value={"Worker"}>Worker</option>
            <option value={"Owner"}>Owner</option>
          </select>
          {role === "Worker" ? (
            <>
              <input
                className="form-control"
                placeholder="Store Name"
                onChange={(e) => {
                  setStoreName(e.target.value);
                }}
                required
              />
              <input
                className="form-control"
                placeholder="Store Identifier"
                onChange={(e) => {
                  setStoreIdentifier(e.target.value);
                }}
                required
              />
            </>
          ) : (
            <></>
          )}
          <button type="submit" className="btn submit-button">
            Submit
          </button>
        </form>
      ) : (
        <div className={"loader"}></div>
      )}
    </div>
  );
}
