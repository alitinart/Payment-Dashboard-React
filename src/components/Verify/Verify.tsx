import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationProvider from "../../functions/notificationProvider";
import { userRequests, userSync } from "../../functions/requests";
import verificationGuard from "../../functions/verificationGuard";
import { State } from "../../models/stateModel";

export default function Verify() {
  const [code, setCode] = React.useState<string>("");

  const { token, verified } = useSelector((state: State) => state);

  const dispatch = useDispatch();
  const nav = useNavigate();

  React.useEffect(() => {
    if (verificationGuard(verified)) {
      nav("/");
    }
    return () => {};
  }, []);

  const onSubmit = async () => {
    const resData = await userRequests.verifyAccount(token, code);

    if (resData.error) {
      return NotificationProvider("Error", resData.message, "danger");
    }

    const syncedToken = await userSync(token);
    localStorage.setItem("token", syncedToken.message.data.accessToken);
    dispatch({
      type: "syncToken",
      token: syncedToken.message.data.accessToken,
    });
    dispatch({
      type: "verification",
      verified: true,
    });

    NotificationProvider(
      "Verified User",
      "User has been successfully verified",
      "success"
    );

    nav("/");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="verify"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
      }}
    >
      <h1 className="title">Verify Your Account</h1>
      <input
        type={"text"}
        placeholder="Verification Code"
        className="form-control"
        value={code}
        onChange={(e) => {
          setCode(e.target.value);
        }}
        required
      />
      <button type="submit" className="btn" style={{ width: "100%" }}>
        Submit
      </button>
    </form>
  );
}
