import * as React from "react";
import "@pathofdev/react-tag-input/build/index.css";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import {
  storeRequests,
  userRequests,
  userSync,
} from "../../../functions/requests";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../../models/stateModel";
import NotificationProvider from "../../../functions/notificationProvider";
import { useNavigate } from "react-router-dom";

export default function CreateStore() {
  const [submit, setSubmit] = React.useState(false);
  const [tags, setTags] = React.useState([]);
  const [name, setName] = React.useState("");

  const dispatch = useDispatch();
  const nav = useNavigate();

  const { token } = useSelector((state: State) => state);

  const submitHandler = async () => {
    const resData = await storeRequests.addStore(token, name, tags);

    if (resData.error) {
      setSubmit(false);
      return NotificationProvider("Error", resData.message, "danger");
    }

    NotificationProvider("Success", resData.message, "success");
    const newToken = await userSync(token);
    const userObject = await userRequests.userObject(
      newToken.message.data.accessToken
    );
    dispatch({
      type: "sync",
      user: userObject.message.data,
      token: newToken.message.data.accessToken,
    });

    nav("/stores");
  };

  return (
    <div className="create-store">
      {!submit ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmit(true);
            submitHandler();
          }}
          className={"form"}
        >
          <h1 className="title">Create Store</h1>
          <input
            className="form-control"
            type={"text"}
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
            placeholder="Store Name"
            required
          />
          <ReactTagInput
            tags={tags}
            placeholder="Add Locations"
            onChange={(newTags: any) => setTags(newTags)}
          />
          <button
            type="submit"
            style={{ marginTop: "10px" }}
            className="btn submit-button"
          >
            Submit
          </button>
        </form>
      ) : (
        <div className={"loader"}></div>
      )}
    </div>
  );
}
