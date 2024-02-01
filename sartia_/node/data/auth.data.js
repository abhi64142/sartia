const UserModel = require("../models/users.model");

const get_user = async (email) => {
  return await UserModel.find({ email: email });
};

const create_user = async (user_name, email, password, user_type, otp) => {
  console.log("usernamw-----------", user_name);
  var user = new UserModel({
    user_name,
    email,
    password,
    user_type,
    otp,
  });
  return await user.save();
};

module.exports = {
  create_user,
  get_user,
};
