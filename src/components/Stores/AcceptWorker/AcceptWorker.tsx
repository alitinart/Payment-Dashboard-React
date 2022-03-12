import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationProvider from "../../../functions/notificationProvider";
import { userRequests } from "../../../functions/requests";
import { State } from "../../../models/stateModel";
import { Store } from "../../../models/storeModel";

export default function AcceptWorker(props: {
  fullName: string;
  _id: string;
  status: string;
  syncStore: any;
}) {
  const { fullName, _id, status, syncStore } = props;
  const { token } = useSelector((state: State) => state);

  const setUserStatus = async (judge: string) => {
    const resData = await userRequests.acceptWorker(_id, judge, token);

    if (resData.error) {
      return NotificationProvider("Error", resData.message, "danger");
    }

    NotificationProvider("Success", resData.message, "success");
    syncStore();
  };

  return (
    <div className="accept-worker">
      <h1>{fullName}</h1>
      <p>ID:{_id}</p>
      <p>Current Status: {status}</p>
      <button
        className="btn"
        style={{ marginRight: "10px", marginTop: "10px" }}
        onClick={() => {
          setUserStatus("allowed");
        }}
      >
        Accept
      </button>
      <button
        className="btn"
        onClick={() => {
          setUserStatus("not allowed");
        }}
      >
        Deny
      </button>
    </div>
  );
}
