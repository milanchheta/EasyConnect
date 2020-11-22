/**
 * Redux store action dispatched for change in email text during login.
 * @param {email} email
 */
export const updateLoginEmail = (email) => ({
  type: "ON_CHANGE_LOGIN_EMAIL",
  data: email,
});

/**
 * Redux store action dispatched for change in password text during login.
 * @param {password} password
 */
export const updateLoginPassword = (password) => ({
  type: "ON_CHANGE_LOGIN_PASSWORD",
  data: password,
});

/**
 * Redux store action dispatched to store the jwt token after user login.
 * @param {token} token
 */
export const storeJwtToken = (token) => ({
  type: "STORE_JWT",
  data: token,
});

/**
 * Redux store action dispatched for user logout from application.
 */
export const logout = (token) => ({
  type: "USER_LOGGED_OUT",
});
