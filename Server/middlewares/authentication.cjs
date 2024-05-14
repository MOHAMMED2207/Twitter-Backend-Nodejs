const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../Model/Auth.cjs");

module.exports = (req, res, next) => {
  dotenv.config();
  //    get req, res, next from express
  try {
    const fullToken = req.headers.authorization;
    let token = fullToken.split(" ")[1]; //    get token from header
    if (!token) return res.status(403).send("Access Denied"); //  status(403) is a forbidden , send msg
    let user = Jwt.verify(token, process.env.JWT_SECRET); //    get user from token
    req.user = user;
    next(); //    go to next middleware
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send("Invalid JWT"); //    send error msg
  }
};
