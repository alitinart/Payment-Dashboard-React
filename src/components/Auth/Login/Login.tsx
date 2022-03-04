import * as React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import authGuard from "../../../functions/authGuard";
import NotificationProvider from "../../../functions/notificationProvider";
import { userRequests } from "../../../functions/requests";

export default function Login() {
  const [submit, setSubmit] = React.useState(false);

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const nav = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = async () => {
    const resData = await userRequests.login(email, password);
    if (resData.error) {
      setSubmit(false);
      return NotificationProvider("Error", resData.message, "danger");
    }
    localStorage.setItem("token", resData.message.data.accessToken);
    localStorage.setItem("refreshId", resData.message.data.refreshId);

    dispatch({
      type: "login",
      user: {
        token: resData.message.data.accessToken,
        refreshId: resData.message.data.refreshId,
      },
    });

    nav("/");
  };

  return (
    <div className="login">
      {!submit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmit(true);
            submitHandler();
          }}
          className={"form"}
        >
          <h1 className="title">Login</h1>
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
