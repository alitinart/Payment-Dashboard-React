import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import verificationGuard from "../../functions/verificationGuard";
import { State } from "../../models/stateModel";

import "./Stores.css";

export default function Stores() {
  const nav = useNavigate();

  const { user, verified } = useSelector((state: State) => state);

  React.useEffect(() => {
    if (!verificationGuard(verified)) {
      nav("/verify");
    }
    return () => {};
  }, []);

  return user ? (
    <>
      <h1 className="big-title">Stores</h1>
      <div className="stores">
        {user.role === "Owner" ? (
          user.stores.length > 0 ? (
            <>
              {user.stores.map((store) => {
                return (
                  <div className="store-item" key={store._id}>
                    <h1>{store.name}</h1>
                    <button
                      className="btn btn-white"
                      onClick={() => {
                        nav("/stores/" + store._id);
                      }}
                    >
                      Check Dashboard
                    </button>
                  </div>
                );
              })}
              <button
                className="btn create-store-button"
                onClick={() => {
                  nav("/stores/create");
                }}
              >
                Create Store
              </button>
            </>
          ) : (
            <>
              <button className="btn create-store-button">No Stores</button>
              <button
                className="btn create-store-button"
                onClick={() => {
                  nav("/stores/create");
                }}
              >
                Create Store
              </button>
            </>
          )
        ) : user.role === "Worker" ? (
          user.store ? (
            <div className="store-item" key={user.store._id}>
              <h1>{user.store.name}</h1>
              {user.store.status === "Accepted" ? (
                <button
                  className="btn btn-white"
                  onClick={() => {
                    nav("/stores/" + user.store?._id);
                  }}
                >
                  Check Dashboard
                </button>
              ) : user.store.status === "Pending" ? (
                <button className="btn btn-white">Pending Approval</button>
              ) : (
                <button className="btn btn-white">You have been denied</button>
              )}
            </div>
          ) : (
            <h1>You are not connected to any stores</h1>
          )
        ) : (
          <h1>Error no role found</h1>
        )}
      </div>
    </>
  ) : (
    <div className="loader"></div>
  );
}
