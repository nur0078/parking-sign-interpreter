const express = require("express");
const router = express.Router();
const LLMService = require("../services/llmService").default;

router.post("/interpret-sign", async (req, res, next) => {
  try {
    const { image } = req.body;
    const currentDateTime = new Date().toLocaleString();

    const interpretation = await LLMService.interpretParkingSign(
      image,
      currentDateTime
    );

    res.json({ interpretation });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
