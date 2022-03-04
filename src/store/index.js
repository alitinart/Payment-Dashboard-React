import redux, { createStore } from "redux";

const appReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: { token: action.user.token, refreshId: action.user.refreshId },
      };
    case "logout":
      if (action.type === "logout") {
        return {
          ...state,
          user: null,
        };
      }
    default:
      return state;
  }
};

const store = createStore(appReducer);

export default store;
