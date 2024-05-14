const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const AuthRouter = require("./Routes/Auth.cjs");
const UserRouter = require("./Routes/UserAccount.cjs");
const PostsRouter = require("./Routes/Posts.cjs");
const notificationRoutes = require("./Routes/Notification.cjs");
const dotenv = require("dotenv");
const app = express();
dotenv.config();
app.use(bodyParser.json());
// -----------------------------------------Routering
app.use("/", AuthRouter); // Auth
app.use("/", UserRouter); // User
app.use("/", PostsRouter); // Post
app.use("/api/notifications", notificationRoutes);

// -----------------------------------------Routering

// ---------------------------------------------------------------------------------------------------------------------
const URL = process.env.MONGOO_URL; //
const connect = async () => {
  try {
    mongoose.set("strictQuery", false); //
    mongoose.connect(URL); // conmect url to mongoDB
    console.log("connected to mongoDB");
  } catch (err) {
    //
    console.log(err);
    process.exit();
  }
};
connect();
// ---------------------------------------------------------------------------------------------------------------------

//
app.listen(8000); //  is port number
//
