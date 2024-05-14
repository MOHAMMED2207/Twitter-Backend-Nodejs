const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationScheam = new Schema(
  {
    // this is the schema of the user collection in the database
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth", // this will be used to check if the notification is for a user or a post
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "auth", // this will be used to check if the notification is for a user or a post
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["follow", "like"], // this will be used to check if the notification is a follow or a like
    },
    read: {
      // this will be used to check if the notification has been read or not
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true } // this will add createdAt and updatedAt timestamps
);

module.exports = mongoose.model("Notification", NotificationScheam); // user is the name of the collection in the database
