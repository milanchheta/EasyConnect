import { combineReducers } from "redux";

import loginReducer from "./LoginReducer";
import registerReducer from "./RegisterReducer";

const rootReducer = combineReducers({
  login: loginReducer,
  register: registerReducer,
});

export { rootReducer };
