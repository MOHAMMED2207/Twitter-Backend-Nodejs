const UserModel = require("../Model/Auth.cjs");
const NotificationModel = require("../Model/Notification.cjs");
const bcrypt = require("bcrypt");

exports.getUserProfile = async function (req, res) {
  try {
    const { username } = req.params;
    const user = await UserModel.findOne({ username }).select("-Password");
    if (!user) return res.status(404).json({ message: "User not found" });
console.log(user);
    res.status(200).json(user);
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send({ Message: err }); // return error
  }
};

exports.getSuggestedUsers = async function (req, res) {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await UserModel.findById(userId).select(
      "following"
    );

    const users = await UserModel.aggregate([
      {
        $match: {
          // match user
          _id: { $ne: userId }, // not equal to current user
        },
      },
      {
        $sample: {
          // get random users
          size: 10, // get 10 random users
        },
      },
    ]);

    const filteredUsers = users.filter(
      // 1,2,3,4,5,6,
      (user) => !usersFollowedByMe.following.includes(user._id) //  you will enter my followers to remove from them if there is someone there // Give me back everything except anyone who follows him
    );
    const suggestedUsers = filteredUsers.slice(0, 6); // is return 6 users
    suggestedUsers.forEach((user) => (user.password = null));

    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.followUnfollowUser = async function (req, res) {
  try {
    let { id } = req.params;

    let userToModify = await UserModel.findById(id);
    // other user id
    let currentUser = await UserModel.findById(req.user._id);
    // if the user is trying to follow/unfollow himself
    if (id === req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You can't follow/unfollow yourself" });
    }
    // if not found togother user or current user
    if (!userToModify || !currentUser)
      return res.status(400).json({ error: "User not found" });

    const isFollowing = currentUser.following.includes(id); // true || false  // check if the user is following the other user

    if (isFollowing) {
      // Unfollow the user
      await UserModel.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      // Follow the user
      await UserModel.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      await UserModel.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      //   create notification
      const notification = new NotificationModel({
        type: "follow", // follow
        from: req.user._id,
        to: currentUser._id, // to user
        createdAt: Date.now(), // created at
        updatedAt: Date.now(), // updated at
      });
      //    send notification
      await notification.save();
      res.status(200).json({ message: "User followed successfully" });
    }
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send({ Message: err }); // return error
  }
};

exports.updateUser = async function (req, res) {
  try {
    const userId = req.user._id;
    let {
      username,
      email,
      age,
      Phone,
      country,
      city,
      ProfileImg,
      CoverImg,
      bio,
      link,
      newPassword,
      currentPassword,
    } = req.body;
    // -------------------------------------validation-------------------------------------
    let MYUserr = await UserModel.findById(userId);
    if (!MYUserr) return res.status(404).json({ message: "User not found" });

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res.status(400).json({
        error: "Please provide both current password and new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = bcrypt.compare(currentPassword, MYUserr.Password);
      if (!isMatch)
        return res.status(400).json({ error: "Current password is incorrect" });
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      MYUserr.Password = await bcrypt.hash(newPassword, salt);
    }
    // -------------------------------------validation-------------------------------------

    MYUserr.username = username || MYUserr.username;
    MYUserr.email = email || MYUserr.email;
    MYUserr.age = age || MYUserr.age;
    MYUserr.Phone = Phone || MYUserr.Phone;
    MYUserr.country = country || MYUserr.country;
    MYUserr.city = city || MYUserr.city;
    MYUserr.bio = bio || MYUserr.bio;
    MYUserr.link = link || MYUserr.link;
    // MYUserr.ProfileImg = ProfileImg || MYUserr.ProfileImg;
    // MYUserr.CoverImg = CoverImg || MYUserr.CoverImg;

    MYUserr = await MYUserr.save();
    MYUserr.Password = null;
    res.json({
      // return user data and token
      Message: "User Succesfully Update Data ", // msg
      status: 200, // status(200) is a ok , send msg
      user: MYUserr, // user data
    });
  } catch (err) {
    console.log(err); // log error
    return res.status(400).send({ Message: err }); // return error
  }
};
