const express = require("express");
const router = express.Router();
const LLMService = require("../services/llmService");

const validateImage = (base64String) => {
  if (!base64String) {
    throw new Error("No image provided");
  }

  // Check if it's a valid base64 image format
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Invalid image format");
  }

  // Validate mime type
  const type = matches[1];
  if (!type.startsWith("image/")) {
    throw new Error("File must be an image");
  }

  // Validate base64 content
  const base64Data = matches[2];
  if (!base64Data || base64Data.length === 0) {
    throw new Error("Invalid image data");
  }

  // Check file size (rough estimation)
  const sizeInBytes = Buffer.from(base64Data, "base64").length;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  if (sizeInMB > 10) {
    throw new Error("Image size too large (max 10MB)");
  }

  return true;
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
    console.log("📥 Received image interpretation request");
    const { image } = req.body;

    try {
      validateImage(image);
    } catch (validationError) {
      console.error("❌ Image validation failed:", validationError.message);
      const error = new Error(validationError.message);
      error.statusCode = 400;
      throw error;
    }

    const currentDateTime = new Date();
    const formattedDateTime = {
      dayOfWeek: currentDateTime.getDay(),
      hour: currentDateTime.getHours(),
      minute: currentDateTime.getMinutes(),
      date: currentDateTime.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: currentDateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }),
    };

    console.log("⏰ Current DateTime:", formattedDateTime);
    console.log("🔍 Processing image...");

    const interpretation = await LLMService.interpretParkingSign(
      image,
      formattedDateTime
    );

    console.log("✅ Successfully interpreted parking sign");

    res.json({
      success: true,
      interpretation,
      timestamp: currentDateTime.toISOString(),
      requestTime: formattedDateTime,
    });
  } catch (error) {
    console.error("❌ Error processing request:", {
      message: error.message,
      statusCode: error.statusCode || 500,
    });

    if (!error.statusCode) {
      error.statusCode = 500;
    }

    next(error);
  }
});

module.exports = router;
