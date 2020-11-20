import { AccessibilityInfo } from "react-native";

const initialState = {
  fullname: "",
  scholars_link: "",
  interests: "",
};

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
