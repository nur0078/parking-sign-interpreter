const express = require("express");
const router = express.Router();
const LLMService = require("../services/llmService");

router.post("/interpret-sign", async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image) {
      const error = new Error("No image provided");
      error.statusCode = 400;
      throw error;
    }

    const currentDateTime = new Date().toLocaleString();

    const interpretation = await LLMService.interpretParkingSign(
      image,
      currentDateTime
    );

    res.json({ interpretation });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
});

module.exports = router;
