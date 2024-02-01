const auth_data = require("../data/auth.data");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const get_user = async (user_email) => {
  return await auth_data.get_user(user_email);
};

const register_user = async (req_body) => {
  // Create User object with escaped and trimmed data
  let user = await auth_data.create_user(
    req_body.user_name,
    req_body.email,
    req_body.password_hash,
    req_body.user_type,
    req_body.otp
  );
  if (user != -1) {
    return {
      success: true,
      data: {
        ...user.toJSON(),
      },
    };
  } else {
    return {
      success: false,
      data: "Unable to create user",
    };
  }
};

const login_user = async (email, password) => {
  let user = await auth_data.get_user(email);
  if (user.length > 0) {
    //Compare given password with db's hash.
    same = await bcrypt.compare(password, user[0].password);
    if (same) {
      // Check account confirmation.
      if (user[0].is_active) {
        //Prepare JWT token for authentication
        const jwtPayload = { user_id: user[0]._id };

        const jwtData = {
          expiresIn: process.env.JWT_TIMEOUT_DURATION,
        };
        const secret = process.env.JWT_SECRET;
        //Generated JWT token with Payload and secret.
        let token = jwt.sign(jwtPayload, secret, jwtData);
        return {
          success: true,
          data: token,
        };
      } else {
        return {
          success: false,
          data: "User has been blocked. Please contact admin.",
        };
      }
    } else {
      return {
        success: false,
        data: "Wrong Password. Please try again!",
      };
    }
  } else {
    return {
      success: false,
      data: "Wrong Email. Please try again!",
    };
  }
};

module.exports = {
  get_user,
  register_user,
  login_user,
};
