const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
// const { updateOne } = require("../models/User");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(400).json(error);
  }
});

//update a post

router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("post updated successfully");
    } else {
      res.status(400).json("you can update only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//delete a post

router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("post deleted successfully");
    } else {
      res.status(400).json("you can delete only your post");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//like dislike the post

router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("post has been disliked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});



router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json("not found");
  }
});

//timeline post

router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (error) {
    res.status(500).json(error);
  }
});

//get user's all post
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const post = await Post.find({ userId: user._id });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
