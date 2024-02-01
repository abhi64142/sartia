let express = require("express");
let authRouter = require("./auth.routes");
let userRouter = require("./users.routes");

let app = express();

app.use("/auth/", authRouter);
app.use("/users/", userRouter);

module.exports = app;
