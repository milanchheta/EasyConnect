export const updateLoginEmail = (email) => ({
  type: "ON_CHANGE_LOGIN_EMAIL",
  data: email,
});

export const updateLoginPassword = (password) => ({
  type: "ON_CHANGE_LOGIN_PASSWORD",
  data: password,
});
export const storeJwtToken = (token) => ({
  type: "STORE_JWT",
  data: token,
});

export const logout = (token) => ({
  type: "USER_LOGGED_OUT",
});
// export const onSubmit = () => ({
//   type: "ON_SUBMIT_LOGIN",
//   data: token,
// });
