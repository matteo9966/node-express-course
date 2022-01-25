const { createJWT, verifyJWT } = require("./jwtfunctions");
const {attachCookiesToResponse} = require('./cookiefunctions');
module.exports = { createJWT, verifyJWT,attachCookiesToResponse };
