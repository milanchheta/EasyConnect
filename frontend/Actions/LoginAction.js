export const updateLoginEmail = (email) => ({
  type: "ON_CHANGE_LOGIN_EMAIL",
  data: email,
});

export const updateLoginPassword = (password) => ({
  type: "ON_CHANGE_LOGIN_PASSWORD",
  data: password,
});
