const initialState = {
  loginEmail: "",
  loginPassword: "",
  jwtToken: "",
};

const loginReducer = (state = initialState, action) => {
  console.log(action);
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
