const axios = require("axios");
const { LLM_API_KEY, LLM_API_URL } = require("../config/env");

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

class LLMService {
  async interpretParkingSign(imageBase64, dateTimeInfo) {
    try {
      const { dayOfWeek, hour, minute, date, time } = dateTimeInfo;

      console.log("🕒 Current DateTime:", {
        date,
        time,
        dayOfWeek: DAYS[dayOfWeek],
      });

      const systemPrompt = `You are a parking sign interpreter. Analyze the parking sign in the image and determine:
1. If parking is currently allowed based on the current time: ${time} on ${DAYS[dayOfWeek]}, ${date}
2. If parking is allowed, specify:
   - How long can they park (maximum duration)
   - Until what time they need to leave
   - The parking cost/rate
3. If parking is not allowed, explain why
Format your response in JSON:
{
  "isAllowed": boolean,
  "maxDuration": string or null,
  "mustLeaveBy": string or null,
  "parkingRate": string or null,
  "explanation": string
}`;

      console.log("📝 System Prompt:", systemPrompt);

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64.split(",")[1]}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
          response_format: { type: "json_object" },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LLM_API_KEY}`,
          },
        }
      );

      const result = response.data.choices[0].message.content;
      console.log("🤖 LLM Response:", result);

      const parsedResult = JSON.parse(result);
      console.log("✅ Parsed Result:", parsedResult);

      return parsedResult;
    } catch (error) {
      console.error("❌ LLM Service Error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response?.status === 429) {
        throw new Error(
          "Rate limit exceeded. Please try again in a few moments."
        );
      }

      if (error.response?.data?.error) {
        throw new Error(`API Error: ${error.response.data.error.message}`);
      }

      throw new Error(
        "Failed to interpret the parking sign. Please try again."
      );
    }
  }
}

module.exports = new LLMService();
