import { combineReducers } from "redux";

import loginReducer from "./LoginReducer";
import RecommendationsReducer from "./RecommendationsReducer";

const rootReducer = combineReducers({
  login: loginReducer,
  recommendations: RecommendationsReducer,
});

export { rootReducer };
