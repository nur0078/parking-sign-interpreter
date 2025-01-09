import axios from "axios";
import { getCurrentDateTime } from "../utils/dateTime";

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

export const interpretParkingSign = async (imageData) => {
  try {
    console.log("🚀 API Request Details:", {
      endpoint: `${API_URL}/interpret-sign`,
      dataLength: imageData?.length || 0,
      mimeType: imageData?.split(";")[0] || "unknown",
    });

    // Validate image data
    validateImageData(imageData);

    const requestConfig = {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024,
    };

    console.log("📤 Sending request with config:", {
      timeout: requestConfig.timeout,
      maxContentLength: requestConfig.maxContentLength,
      headers: requestConfig.headers,
    });

    const response = await axios.post(
      `${API_URL}/interpret-sign`,
      {
        image: imageData,
        currentDateTime: getCurrentDateTime(),
      },
      requestConfig
    );

    if (!response.data?.success) {
      console.error("📛 API Response not successful:", response.data);
      throw new Error("Failed to get valid response from server");
    }

    console.log("✅ API Response received:", {
      status: response.status,
      hasInterpretation: !!response.data?.interpretation,
      timestamp: response.data?.timestamp,
    });

    return response.data;
  } catch (error) {
    console.error("❌ API Error Details:", {
      name: error.name,
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      isAxiosError: error.isAxiosError,
      config: error.config,
    });

    // Throw user-friendly error messages
    if (error.message.includes("Invalid image")) {
      throw new Error(error.message);
    } else if (error.response?.status === 413) {
      throw new Error("Image is too large. Please try a smaller image.");
    } else if (error.response?.status === 429) {
      throw new Error("Too many requests. Please try again in a moment.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timed out. Please try again.");
    } else if (!navigator.onLine) {
      throw new Error(
        "No internet connection. Please check your connection and try again."
      );
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(
        "Failed to interpret the parking sign. Please try again."
      );
    }
  }
};
