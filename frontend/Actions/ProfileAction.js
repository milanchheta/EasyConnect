export const profileName = (name) => ({
  type: "ONCHANGE_NAME_PROFILE",
  data: name,
});

export const profileScholarLink = (link) => ({
  type: "ONCHANGE_SCHOLAR_LINK_PROFILE",
  data: link,
});

export const profileInterests = (interests) => ({
  type: "ONCHANGE_INTEREST_PROFILE",
  data: interests,
});
