const UserModel = require("../models/users.model");
const auth_service = require("../services/auth.service");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const utility = require("../helpers/utility");
const bcrypt = require("bcrypt");
// const mailer = require("../helpers/mailer");
const { constants } = require("../helpers/constants");
var ObjectId = require("mongoose").Types.ObjectId;

exports.register = [
  // Validate fields.
  body("user_name")
    .isLength({ min: 1 })
    .trim()
    .withMessage("User name must be specified"),
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom(async (value) => {
      let user = await auth_service.get_user(value);
      if (user.length > 0) {
        return Promise.reject("E-mail already in use");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be 6 characters or greater."),

  // Process request after validation.
  (req, res, next) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error",
          errors.array()
        );
      } else {
        //hash input password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          req.body.otp = utility.randomNumber(4);
          req.body.password_hash = hash;
          auth_service
            .register_user(req.body)
            .then(function (creation_response) {
              if (creation_response.status == false)
                return apiResponse.ErrorResponse(res, creation_response.data);
              else
                return apiResponse.successResponseWithData(
                  res,
                  "Registration Success.",
                  creation_response.data
                );
            });
        });
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

exports.login = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password must be specified."),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        auth_service
          .login_user(req.body.email, req.body.password)
          .then(function (login_response) {
            if (!login_response.success) {
              return apiResponse.ErrorResponse(res, login_response.data);
            } else {
              return apiResponse.successResponseWithData(
                res,
                "Login Success.",
                login_response.data
              );
            }
          });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
