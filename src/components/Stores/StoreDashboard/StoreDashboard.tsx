import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import NotificationProvider from "../../../functions/notificationProvider";
import { storeRequests } from "../../../functions/requests";
import { State } from "../../../models/stateModel";
import { Store } from "../../../models/storeModel";
import AcceptWorker from "../AcceptWorker/AcceptWorker";
import CreateTransaction from "../CreateTransaction/CreateTransaction";

export default function StoreDashboard() {
  const [store, setStore] = React.useState<Store | null>();
  const { id } = useParams();
  const { token, user } = useSelector((state: State) => state);
  const nav = useNavigate();

  let transactionCounter = 0;

  const [loading, setLoading] = React.useState(false);

  const getStore = async () => {
    setLoading(true);
    if (!token) {
      return nav("/stores");
    }
    const resData = await storeRequests.getStoreByID(id, token);
    if (resData.error) {
      return NotificationProvider("Error", resData.message, "danger");
    }
    setStore(resData.message.data);
    setLoading(false);
  };

  React.useEffect(() => {
    getStore();
    return () => {};
  }, []);

  return store ? (
    <>
      <div className="store-dashboard">
        <div className="info">
          <h1 className="store-name">{store.name}</h1>
          <p className="identifier">Identifier: {store.identifier}</p>
          <h1>Locations</h1>
          <ul className="locations">
            {store.locations.map((location) => {
              return (
                <>
                  <li className="location" key={location}>
                    {location}
                  </li>
                </>
              );
            })}
          </ul>
          <h1>Workers</h1>
          <ul className="workers">
            {store.workers.length > 0 ? (
              store.workers.map((worker) => {
                if (worker.status === "Accepted") {
                  return (
                    <li className="worker" key={worker._id}>
                      {worker.fullName}
                    </li>
                  );
                }
              })
            ) : (
              <p>No Workers</p>
            )}
          </ul>
          {user.role === "Owner" ? (
            <div className="accept-workers">
              {store.workers.length > 0 ? (
                store.workers.map((worker) => {
                  if (worker.status === "Pending") {
                    return (
                      <AcceptWorker
                        key={worker._id}
                        fullName={worker.fullName}
                        _id={worker._id}
                        status={worker.status}
                        syncStore={getStore}
                      ></AcceptWorker>
                    );
                  }
                })
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        {user.role === "Owner" ? (
          <div className="live-transactions">
            <h1>Live Transactions</h1>
            <i
              className="bi bi-arrow-clockwise"
              onClick={() => {
                getStore();
              }}
            ></i>
            {!loading ? (
              store.transactions.map((transaction) => {
                if (transactionCounter === 5) {
                  return;
                }
                transactionCounter++;
                return (
                  <div key={transaction._id} className="transaction">
                    <h1>{transaction.item}</h1>
                    <p>Price: {transaction.amount}</p>
                    <p>Method: {transaction.method}</p>
                  </div>
                );
              })
            ) : (
              <div className="loader"></div>
            )}
          </div>
        ) : (
          <CreateTransaction key={"transaction-add"} store={store} />
        )}
      </div>
    </>
  ) : (
    <div className="loader"></div>
  );
}
