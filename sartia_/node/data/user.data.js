const UserModel = require("../models/users.model");

const get_user_by_id = async (user_id) => {
  return await UserModel.findById({ _id: user_id });
};

const list_of_users = async () => {
  return await UserModel.find();
};

const update_user = async (user_id, body) => {
  return await UserModel.updateOne(
    { _id: user_id },
    {
      user_name: body.user_name,
      user_type: body.user_type,
      is_active: body.is_active,
    }
  );
};

const activate_deactivate_user = async (is_active, user_id) => {
  return await UserModel.updateOne({ _id: user_id }, { is_active: is_active });
};

const update_otp = async (user_id, otp) => {
  return await UserModel.findOneAndUpdate({ _id: user_id }, { otp: otp });
};

const verify_user = async (user_details) => {
  return await UserModel.findOneAndUpdate(
    { username: user_details[0].username },
    { is_otp_verified: true }
  );
};

module.exports = {
  list_of_users,
  get_user_by_id,
  update_user,
  activate_deactivate_user,
  update_otp,
  verify_user,
};
