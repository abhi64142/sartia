var express = require("express");
const users_controller = require("../controllers/users.controller");

var router = express.Router();

router.get("/list_of_users", users_controller.list_of_users);
router.put("/update_user/:id", users_controller.update_user_details);
router.put("/active_deactive_user", users_controller.activate_deactivate_user);

// sendgrid not working due to their server issue.
router.post("/verify-email", users_controller.verify_email);
router.post("/forgot-password", users_controller.forgot_password);

module.exports = router;
