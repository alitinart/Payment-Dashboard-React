import redux, { createStore } from "redux";

const appReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        token: action.token,
        refreshId: action.refreshId,
        user: action.user,
      };
    case "logout":
      return {
        ...state,
        user: null,
        token: null,
        refreshId: null,
      };
    case "sync":
      return {
        ...state,
        user: action.user,
        token: action.token,
      };
    case "verification":
      return {
        ...state,
        verified: action.verified,
      };
    case "syncToken":
      return {
        ...state,
        token: action.token,
      };
    default:
      return state;
  }
};

const store = createStore(appReducer);

export default store;
