/**
 * Redux store action dispatched for change in email text during registration.
 * @param {email} email
 */
export const registerEmail = (email) => ({
  type: "ONCHANGE_EMAIL_REGISTER",
  data: email,
});

/**
 * Redux store action dispatched for change in name text during registration.
 * @param {name} name
 */
export const registerName = (name) => ({
  type: "ONCHANGE_NAME_REGISTER",
  data: name,
});

/**
 * Redux store action dispatched for change in password text during registration.
 * @param {password} password
 */
export const registerPassword = (password) => ({
  type: "ONCHANGE_PASSWORD_REGISTER",
  data: password,
});

/**
 * Redux store action dispatched for change in confirm password text during registration.
 * @param {password} password
 */
export const registerConfirmPassword = (password) => ({
  type: "ONCHANGE_CONFIRM_PASSWORD_REGISTER",
  data: password,
});

/**
 * Redux store action dispatched for change in google scholar link during registration.
 * @param {link} link
 */
export const registerScholarLink = (link) => ({
  type: "ONCHANGE_SCHOLAR_LINK_REGISTER",
  data: link,
});

/**
 * Redux store action dispatched for change in user interests during registration.
 * @param {interesets} interests
 */
export const registerInterests = (interests) => ({
  type: "ONCHANGE_INTEREST_REGISTER",
  data: interests,
});
