import { combineReducers } from "redux";

import loginReducer from "./LoginReducer";
import registerReducer from "./RegisterReducer";
import RecommendationsReducer from "./RecommendationsReducer";
import profileReducer from "./ProfileReducer";

/**
 * Combine all reducers under one roof, app reducer.
 */
const appReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  recommendations: RecommendationsReducer,
  profile: profileReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "USER_LOGGED_OUT") {
    state = undefined;
  }

  return appReducer(state, action);
};
export { rootReducer };
