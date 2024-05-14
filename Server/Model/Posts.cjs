const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "auth",
			required: true,
		},
    text: {
      type: String,
    },
    img: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "auth",
          required: true,
        },
      },
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
