const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
//register
router.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const users = await user.save();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json(e);
  }
});

//login
router.post("/login", async (req, res) => {
  // console.log("hfudhgbubgfbgfjbbffguguvbfubg fvgv");

  try {
    const user = await User.findOne(
      { email: req.body.email }
      // (e, data) => {
      //   console.log(e);
      //   console.log(data);
      // }
    );

    !user && res.status(404).json("user not found");
    // console.log(user.password)
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("wrong password");
    res.status(200).json(user);
    // console.log(`finding ${req.body.username}`);
    // if (!users) {
    //   res.status(404).json("user not found");
    // } else {
    //   res.status(200).json("success");
    // }
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
