import { combineReducers } from "redux";

import loginReducer from "./LoginReducer";
import registerReducer from "./RegisterReducer";
import RecommendationsReducer from "./RecommendationsReducer";

const appReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  recommendations: RecommendationsReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGGED_OUT") {
    state = undefined;
  }

  return appReducer(state, action);
};
export { rootReducer };
