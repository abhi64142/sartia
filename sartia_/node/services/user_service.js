const user_data = require("../data/user.data");
const auth_data = require("../data/auth.data");

const list_of_users = async () => {
  let user_list = await user_data.list_of_users();
  return {
    success: true,
    data: user_list,
  };
};

const update_user = async (user_id, body) => {
  let update_data = await user_data.update_user(user_id, body);
  return {
    success: true,
    data: update_data,
  };
};

const activate_deactivate_user = async (is_active, user_id) => {
  let user = await user_data.get_user_by_id(user_id);
  if (user) {
    let response = await user_data.activate_deactivate_user(is_active, user_id);
    if (response.nModified > 0) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: "Unable to update the status.",
      };
    }
  } else {
    return {
      success: false,
      data: "Unable to locate user. Please check the user's ID.",
    };
  }
};

const update_otp = async (user_id, otp) => {
  let update_otp_response = await user_data.update_otp(user_id, otp);
  return {
    success: true,
    data: update_otp_response,
  };
};

const verify_user = async (email, otp) => {
  let user_details = await auth_data.get_user(email);
  if (user_details[0].otp == otp) {
    let response = await user_data.verify_user(user_details);
    if (response != -1) {
      return {
        success: true,
        data: response,
      };
    } else {
      return {
        success: false,
        data: "Sorry!, Unable to verify the user",
      };
    }
  } else {
    return {
      success: false,
      data: "Sorry!, Incorrect OTP entered",
    };
  }
};

module.exports = {
  list_of_users,
  update_user,
  activate_deactivate_user,
  update_otp,
  verify_user,
};
