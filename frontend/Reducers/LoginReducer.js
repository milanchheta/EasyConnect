import AsyncStorage from "@react-native-community/async-storage";

const initialState = {
  loginEmail: "",
  loginPassword: "",
  jwtToken: "",
};

/**
 * Reducer to handle the actions dispatched during login.
 * @param {state} state present state of the redux store. If not present, falls back to the initial state.
 * @param {action} action action dispatched by the react component.
 */
const loginReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ON_CHANGE_LOGIN_EMAIL":
      return {
        ...state,
        loginEmail: action.data,
      };

    case "ON_CHANGE_LOGIN_PASSWORD":
      return {
        ...state,
        loginPassword: action.data,
      };
    case "STORE_JWT":
      return {
        ...state,
        jwtToken: action.data,
      };

    default:
      return state;
  }
};

export default loginReducer;
