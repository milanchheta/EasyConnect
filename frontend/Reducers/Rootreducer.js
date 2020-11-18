import { combineReducers } from "redux";

import loginReducer from "./LoginReducer";
import registerReducer from "./RegisterReducer";
import RecommendationsReducer from "./RecommendationsReducer";

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
  recommendations: RecommendationsReducer,
});

export { rootReducer };
