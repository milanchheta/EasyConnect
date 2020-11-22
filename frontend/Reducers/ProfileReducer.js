import { AccessibilityInfo } from "react-native";

const initialState = {
  fullname: "",
  scholars_link: "",
  interests: "",
};

/**
 * Reducer to handle the actions dispatched during profile edit.
 * @param {state} state present state of the redux store. If not present, falls back to the initial state.
 * @param {action} action action dispatched by the react component.
 */
const profileReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ONCHANGE_NAME_PROFILE":
      return {
        ...state,
        fullname: action.data,
      };

    case "ONCHANGE_SCHOLAR_LINK_PROFILE":
      return {
        ...state,
        scholars_link: action.data,
      };

    case "ONCHANGE_INTEREST_PROFILE":
      return {
        ...state,
        interests: action.data,
      };

    default:
      return state;
  }
};

export default profileReducer;
