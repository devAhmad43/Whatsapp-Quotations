const jwt = require("jsonwebtoken");
const secretID = process.env.secret_ID_JWT
const generateToken = (id) => {
  return jwt.sign({ id }, secretID, {
    expiresIn: "30d",
  });
};
module.exports = generateToken;
