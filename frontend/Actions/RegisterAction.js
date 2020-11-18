export const registerEmail = (email) => ({
    type: "ONCHANGE_EMAIL_REGISTER",
    data: email
});

export const registerName = (name) => ({
    type: "ONCHANGE_NAME_REGISTER",
    data: name
});

export const registerPassword = (password) => ({
    type: "ONCHANGE_PASSWORD_REGISTER",
    data: password
});

export const registerConfirmPassword = (password) => ({
    type: "ONCHANGE_CONFIRM_PASSWORD_REGISTER",
    data: password
});

export const registerScholarLink = (link) => ({
    type: "ONCHANGE_SCHOLAR_LINK_REGISTER",
    data: link
});

export const registerInterests = (interests) => ({
    type: "ONCHANGE_INTEREST_REGISTER",
    data: interests
});