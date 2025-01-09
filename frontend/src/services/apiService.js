import axios from "axios";

// Use your computer's local IP address for mobile testing
const API_URL =
  import.meta.env.VITE_BACKEND_API_URL || "http://192.168.1.7:3000/api";

const validateImageData = (imageData) => {
  if (!imageData) {
    throw new Error("No image data provided");
  }

  if (!imageData.startsWith("data:image/")) {
    throw new Error("Invalid image format. Must be a valid image file.");
  }

  // Check if base64 part exists
  const base64Data = imageData.split(",")[1];
  if (!base64Data) {
    throw new Error("Invalid image data format");
  }

  return true;
};

export const interpretParkingSign = async (base64Image) => {
  try {
    // Get current date and time from device
    const now = new Date();
    const currentDateTime = {
      dayOfWeek: now.getDay(),
      hour: now.getHours(),
      minute: now.getMinutes(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
    };

    const response = await fetch(`${API_URL}/interpret-sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: base64Image,
        currentDateTime,
      }),
    });

    if (!response.ok) {
      throw new Error(
        "Failed to interpret the parking sign. Please try again."
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(
      error.message || "Failed to interpret the parking sign. Please try again."
    );
  }
};
