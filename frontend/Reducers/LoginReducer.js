const initialState = {
  loginEmail: "",
  loginPassword: "",
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

    default:
      return state;
  }
};

export default loginReducer;
