const express = require("express");
const router = express.Router();
const LLMService = require("../services/llmService");

const validateImage = (base64String) => {
  if (!base64String) return false;
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) return false;
  const type = matches[1];
  return type.startsWith("image/");
};

// Test endpoint with sample image
router.get("/test-interpretation", async (req, res, next) => {
  try {
    // Sample parking sign image (replace with your test image)
    const sampleImage = "data:image/jpeg;base64,/9j/4AAQSkZJRg..."; // You'll need to provide a real base64 image here

    const currentDateTime = new Date();
    const formattedDateTime = {
      dayOfWeek: currentDateTime.getDay(),
      hour: currentDateTime.getHours(),
      minute: currentDateTime.getMinutes(),
      date: currentDateTime.toLocaleDateString(),
      time: currentDateTime.toLocaleTimeString(),
    };

    console.log("📸 Testing sign interpretation with sample image");
    const interpretation = await LLMService.interpretParkingSign(
      sampleImage,
      formattedDateTime
    );

    res.json({
      success: true,
      interpretation,
      timestamp: currentDateTime.toISOString(),
      requestTime: formattedDateTime,
    });
  } catch (error) {
    next(error);
  }
});

// Original endpoint
router.post("/interpret-sign", async (req, res, next) => {
  try {
    const { image } = req.body;
    if (!image || !validateImage(image)) {
      const error = new Error(
        "Invalid or missing image. Please provide a valid base64 encoded image."
      );
      error.statusCode = 400;
      throw error;
    }

    const currentDateTime = new Date();
    const formattedDateTime = {
      dayOfWeek: currentDateTime.getDay(),
      hour: currentDateTime.getHours(),
      minute: currentDateTime.getMinutes(),
      date: currentDateTime.toLocaleDateString(),
      time: currentDateTime.toLocaleTimeString(),
    };

    console.log("📸 Processing user-submitted image");
    const interpretation = await LLMService.interpretParkingSign(
      image,
      formattedDateTime
    );

    res.json({
      success: true,
      interpretation,
      timestamp: currentDateTime.toISOString(),
      requestTime: formattedDateTime,
    });
  } catch (error) {
    console.error("❌ Error processing request:", error.message);
    next(error);
  }
});

module.exports = router;
