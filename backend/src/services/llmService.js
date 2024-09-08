const axios = require("axios"); // Import axios
const { LLM_API_KEY, LLM_API_URL } = require("../config/env");

class LLMService {
  async interpretParkingSign(imageBase64, currentDateTime) {
    try {
      const response = await axios.post(
        LLM_API_URL,
        {
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Interpret the parking sign in this image. The current date and time is ${currentDateTime}. Provide a clear, concise explanation of whether parking is allowed, any time restrictions, and any other relevant details.`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64.split(",")[1]}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 300,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LLM_API_KEY}`,
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      let errorMessage = "Failed to interpret parking sign due to an error";

      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `Error from LLM API: ${error.response.data.error.message}`;
        if (error.response.data.error.code === "insufficient_quota") {
          // Handle quota exceeded error
          errorMessage =
            "You have exceeded your quota. Please check your plan and billing details.";
        }
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      console.error(errorMessage); // Log the error for debugging
      throw new Error(errorMessage); // Throw a detailed error message
    }
  }
}

module.exports = new LLMService();
