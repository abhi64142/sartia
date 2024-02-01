let express = require("express");
let logger = require("morgan");
require("dotenv").config();
let apiRouter = require("./routes/api");
let apiResponse = require("./helpers/apiResponse");
let mongoose = require("mongoose");

// DB connection
let MONGODB_URL = process.env.MONGODB_URL;
//let MONGODB_URL = "";
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("Connected to %s", MONGODB_URL);
    console.log("App is running ... \n");
    console.log("Press CTRL + C to stop the process. \n");
  })
  .catch((err) => {
    console.error("App starting error:", err.message);
    process.exit(1);
  });
let db = mongoose.connection;

let app = express();

let port = process.env.PORT || 1000;
app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Route Prefixes
app.use("/api", apiRouter);

// throw 404 if URL not found
app.all("*", function (req, res) {
  return apiResponse.notFoundResponse(res, "API not found");
});

app.listen(port, () => {
  console.log(`server is running at port ${port}`);
});
