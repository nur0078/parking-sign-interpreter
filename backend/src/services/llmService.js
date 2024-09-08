const axios = require("axios");
const { LLM_API_KEY, LLM_API_URL } = require("../config/env");

class LLMService {
  async interpretParkingSign(imageBase64, currentDateTime) {
    try {
      const response = await axios.post(
        LLM_API_URL,
        {
          model: "gpt-4-vision-preview",
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
      console.error("Error calling LLM API:", error);
      throw new Error("Failed to interpret parking sign");
    }
  }
}

module.exports = new LLMService();
