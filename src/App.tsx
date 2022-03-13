import { useSelector, useDispatch } from "react-redux";

import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./pageComponents/Header/Header";
import Auth from "./components/Auth/Auth";

import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import NotificationProvider from "./functions/notificationProvider";
import { userRequests, userSync } from "./functions/requests";
import Stores from "./components/Stores/Stores";
import CreateStore from "./components/Stores/CreateStore/CreateStore";
import StoreDashboard from "./components/Stores/StoreDashboard/StoreDashboard";
import Dashboard from "./components/Dashboard/Dashboard";
import Verify from "./components/Verify/Verify";

function App() {
  const dispatch = useDispatch();

  React.useEffect(() => {
    const authUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }
      if (token) {
        const resData = await userSync(token);

        if (resData.error) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshId");
          return NotificationProvider(
            "Session Expired",
            resData.message,
            "danger"
          );
        }
        if (!localStorage.getItem("refreshId")) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshId");
          return NotificationProvider(
            "Session Expired",
            "No Refresh ID",
            "danger"
          );
        }
        const syncedToken = await userSync(token);
        const userObject = await userRequests.userObject(
          syncedToken.message.data.accessToken
        );
        dispatch({
          type: "login",
          token,
          refreshId: localStorage.getItem("refreshId"),
          user: userObject.message.data,
        });
        dispatch({
          type: "verification",
          verified: userObject.message.data.verified,
        });
      }
    };
    authUser();
    return () => {};
  }, []);

  return (
    <BrowserRouter>
      <Header></Header>
      <ReactNotifications />
      <Routes>
        <Route path="/auth/:type" element={<Auth />}></Route>
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:id" element={<StoreDashboard />} />
        <Route path="/stores/create" element={<CreateStore />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/verify" element={<Verify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
