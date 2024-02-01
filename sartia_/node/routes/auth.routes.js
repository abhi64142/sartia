var express = require("express");
const auth_controller = require("../controllers/auth.controller");

var router = express.Router();

router.post("/register", auth_controller.register);
router.post("/login", auth_controller.login);

module.exports = router;
