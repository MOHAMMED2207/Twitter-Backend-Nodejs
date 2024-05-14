const NotificationModel = require("../Model/Notification.cjs");
const UserModel = require("../Model/Auth.cjs");
const PostModel = require("../Model/Posts.cjs");
// import { v2 as cloudinary } from "cloudinary";

exports.createPost = async function (req, res) {
  try {
    let { img, text } = req.body;
    const userId = req.user._id.toString();
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!text && !img) {
      return res.status(400).json({ error: "Post must have text or image" });
    }

    // if (img) {
    //   const uploadedResponse = await cloudinary.uploader.upload(img);
    //   img = uploadedResponse.secure_url;
    // }

    const newPost = new PostModel({
      user: userId,
      text,
      img,
    });

    await newPost.save();
    res
      .status(201)
      .json({ Message: "Posted Successfully", Status: 200, Post: newPost });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log("Error in createPost controller: ", error);
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.id);
    console.log(post);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }

    await PostModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ error: "Text field is required" });
    }
    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.log("Error in commentOnPost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.likeUnlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const UserLikedPost = post.likes.includes(userId); // check if user has already liked the post

    if (UserLikedPost) {
      // if user has already liked the post, then remove the user from the likes array
      // UnLike
      await PostModel.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await UserModel.updateOne(
        { _id: userId },
        { $pull: { likedPosts: postId } }
      );

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      res
        .status(200)
        .json({ Message: "Your Unliked this Post", Likes: updatedLikes });
    } else {
      // Like
      post.likes.push(userId);
      await UserModel.updateOne(
        { _id: userId },
        { $push: { likedPosts: postId } }
      );
      await post.save();

      const notification = new NotificationModel({
        //  send notification
        type: "like", // like
        from: userId,
        to: post.user, // to user
      });
      await notification.save(); //  send notification

      const updatedLikes = post.likes;
      res
        .status(200)
        .json({ Message: "liked Successfully", Likes: updatedLikes });
    }
  } catch (error) {
    console.log("Error in likeUnlikePost controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: " -email -Password",
      })
      .populate({
        path: "comments.user",
        select: " -email -Password",
      });
    // descending order (A.B., from newest to oldest). The '-1' indicates descending order

    if (posts.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getLikedPosts = async (req, res) => {
  let userId = req.params.id;
  try {
    let user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    const likedPosts = await PostModel.findById({
      _id: { $in: user.likedPosts },
    });

    // const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const following = user.following;

    const feedPosts = await PostModel.find({ user: { $in: following } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(feedPosts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const posts = await PostModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
