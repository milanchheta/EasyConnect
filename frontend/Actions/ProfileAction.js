/**
 * Redux store action dispatched for change in profile name during update.
 * @param {name} name
 */
export const profileName = (name) => ({
  type: "ONCHANGE_NAME_PROFILE",
  data: name,
});

/**
 * Redux store action dispatched for change in google scholar link during profile update.
 * @param {link} link
 */
export const profileScholarLink = (link) => ({
  type: "ONCHANGE_SCHOLAR_LINK_PROFILE",
  data: link,
});

/**
 * Redux store action dispatched for change in user interests during profile update.
 * @param {interests} interests
 */
export const profileInterests = (interests) => ({
  type: "ONCHANGE_INTEREST_PROFILE",
  data: interests,
});
