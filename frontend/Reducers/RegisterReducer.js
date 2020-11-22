import { AccessibilityInfo } from "react-native";

const initialState = {
  fullname: "",
  email: "",
  password: "",
  confirm_password: "",
  scholars_link: "",
  interests: "",
};

/**
 * Reducer to handle the actions dispatched during new user registration for the application.
 * @param {state} state present state of the redux store. If not present, falls back to the initial state.
 * @param {action} action action dispatched by the react component.
 */
const registerReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ONCHANGE_EMAIL_REGISTER":
      return {
        ...state,
        email: action.data,
      };

    case "ONCHANGE_NAME_REGISTER":
      return {
        ...state,
        fullname: action.data,
      };

    case "ONCHANGE_PASSWORD_REGISTER":
      return {
        ...state,
        password: action.data,
      };

    case "ONCHANGE_CONFIRM_PASSWORD_REGISTER":
      return {
        ...state,
        confirm_password: action.data,
      };

    case "ONCHANGE_SCHOLAR_LINK_REGISTER":
      return {
        ...state,
        scholars_link: action.data,
      };

    case "ONCHANGE_INTEREST_REGISTER":
      return {
        ...state,
        interests: action.data,
      };

    default:
      return state;
  }
};

export default registerReducer;
