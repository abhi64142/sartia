const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");
const secret = process.env.JWT_SECRET;
const user_data = require("../data/user.data");

const adminAuthenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader == null)
    return apiResponse.unauthorizedResponse(res, "Unauthorized Token");
  const token = authHeader.split(" ");

  jwt.verify(token[1], secret, async (err, user) => {
    if (err) return apiResponse.unauthorizedResponse(res, "Unauthorized Token");
    console.log("userid--------", user);
    const current_user = await user_data.get_user_by_id(user.user_id);
    console.log("user--------", current_user);
    if (current_user.user_type !== "admin")
      return apiResponse.unauthorizedResponse(
        res,
        "You don't have admin privileges"
      );
    next();
  });
};
module.exports = adminAuthenticate;
