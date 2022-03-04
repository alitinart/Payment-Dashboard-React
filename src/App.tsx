import { useSelector, useDispatch } from "react-redux";

import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./pageComponents/Header/Header";
import Auth from "./components/Auth/Auth";

import { ReactNotifications } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import NotificationProvider from "./functions/notificationProvider";
import { userSync } from "./functions/requests";

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
        dispatch({
          type: "login",
          user: {
            token,
            refreshId: localStorage.getItem("refreshId"),
          },
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
        <Route path="/auth/:type" element={<Auth></Auth>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
