const user_service = require("../services/user_service");
const auth_service = require("../services/auth.service");
const apiResponse = require("../helpers/apiResponse");
const login_validator = require("../middlewares/jwt.middleware");
const admin_validator = require("../middlewares/admin.middleware");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const mailer = require("../helpers/mailer");

exports.list_of_users = [
  login_validator,
  admin_validator,
  (req, res) => {
    user_service.list_of_users().then(function (list_response) {
      if (list_response.success == false)
        return apiResponse.ErrorResponse(res, list_response.data);
      else
        return apiResponse.successResponseWithData(
          res,
          "User list fetched.",
          list_response.data
        );
    });
  },
];

exports.update_user_details = [
  login_validator,
  body("user_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("User name must be specified."),
  body("user_type", "User Type must not be empty."),
  body("is_active", "Active flag cannot be empty.")
    .isBoolean()
    .withMessage("Active flag has to be boolean."),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error",
        errors.array()
      );
    } else {
      if (req.user.user_type != req.body.user_type) {
        return apiResponse.ErrorResponse(
          res,
          "you can't change your user type"
        );
      }
      user_service
        .update_user(req.params.user_id, req.body)
        .then(function (updation) {
          if (updation.success) {
            return apiResponse.successResponseWithData(
              res,
              "User updated Successfuly.",
              updation.data
            );
          } else {
            return apiResponse.ErrorResponse(res, updation.data);
          }
        });
    }
  },
];

exports.activate_deactivate_user = [
  login_validator,
  admin_validator,
  body("user_id")
    .isLength({ min: 1 })
    .trim()
    .withMessage("User Id must be specified.")
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return Promise.reject("Invalid User Id format");
      }
    }),
  body("is_active")
    .isBoolean()
    .withMessage("Active flag has to be boolean.")
    .isLength({ min: 1 })
    .withMessage("is_active is required"),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error",
        errors.array()
      );
    } else {
      const is_active = req.body.is_active;
      const user_id = req.body.user_id;
      user_service
        .activate_deactivate_user(is_active, user_id)
        .then(function (creation_response) {
          if (creation_response.success == false)
            return apiResponse.ErrorResponse(res, creation_response.data);
          else
            return apiResponse.successResponse(
              res,
              "User's status changed successfully!"
            );
        });
    }
  },
];

exports.verify_email = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom(async (value) => {
      let user = await auth_service.get_user(value);
      if (user.data.length == 0) {
        return Promise.reject("E-mail is not registered");
      }
    }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error",
        errors.array()
      );
    } else {
      let user = await auth_service.get_user(req.body.email);
      req.body.otp = utility.randomNumber(4);
      const subject = "Please verify OTP to complete forgot password request";
      let update_otp = await user_service.update_otp(
        user.data[0]._id,
        req.body.otp
      );
      const emailBody = `
      <html>
        <body>
          <h5>OTP is ${req.body.otp}</h5>
        </body>
      </html>
    `;
      mailer.sendGrid(
        process.env.EMAIL_FROM,
        user.data[0].email,
        subject,
        emailBody
      );
      return apiResponse.successResponse(
        res,
        "Email sent to user successfully for otp verification."
      );
    }
  },
];

exports.forgot_password = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom(async (value) => {
      let user = await auth_service.get_user(value);
      if (user.data.length == 0) {
        return Promise.reject("E-mail is not registered");
      }
    }),
  body("otp")
    .isLength({ min: 4 })
    .trim()
    .withMessage("otp should length should be 4"),
  body("new_password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be 6 characters or greater."),
  body("confirm_password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Confirm password must be specified."),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationErrorWithData(
        res,
        "Validation Error",
        errors.array()
      );
    } else {
      user_service
        .verify_user(req.body.email, req.body.otp)
        .then(function (creation_response) {
          if (creation_response.success == false) {
            return apiResponse.ErrorResponse(res, creation_response.data);
          } else {
            if (req.body.new_password == req.body.confirm_password) {
              bcrypt.hash(req.body.new_password, 10, function (err, hash) {
                req.body.password_hash = hash;
                user_service
                  .change_password_by_email(
                    req.body.email,
                    req.body.password_hash
                  )
                  .then(function (creation_response) {
                    if (creation_response.success == false)
                      return apiResponse.ErrorResponse(
                        res,
                        creation_response.data
                      );
                    else
                      return apiResponse.successResponse(
                        res,
                        "Forgot Password request fullfilled!."
                      );
                  });
              });
            } else {
              return apiResponse.ErrorResponse(
                res,
                "New password and confirm password do not match"
              );
            }
          }
        });
    }
  },
];
