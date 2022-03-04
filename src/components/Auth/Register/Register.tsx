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

  const nav = useNavigate();

  const submitHandler = async () => {
    const resData = await userRequests.register(
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
            className="form-control"
            required
          >
            <option value={"Worker"}>Worker</option>
            <option value={"Owner"}>Owner</option>
          </select>
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
