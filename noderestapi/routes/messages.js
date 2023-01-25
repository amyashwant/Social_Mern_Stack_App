const router = require("express").Router();
const Messages = require("../models/Message");

router.post("/", async (req, res) => {
  const newMessage = new Messages(req.body);

  try {
    const savedMessages = await newMessage.save();
    res.status(200).json(savedMessages);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
