const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");
const secret = process.env.JWT_SECRET;
const user_data = require("../data/user.data");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  let token = "";
  if (!authHeader) {
    return apiResponse.unauthorizedResponse(res, "Unauthorized Token");
  }
  if (authHeader) token = authHeader.split(" ");

  jwt.verify(token[1], secret, async (err, user) => {
    if (err) {
      return apiResponse.unauthorizedResponse(res, "Unauthorized Token");
    } else {
      const current_user = await user_data.get_user_by_id(user.user_id);
      req.user = current_user;
    }
    next();
  });
};
module.exports = authenticateToken;
