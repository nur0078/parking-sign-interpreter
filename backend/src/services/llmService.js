const axios = require("axios");
const { LLM_API_KEY } = require("../config/env");

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

      const systemPrompt = `You are a parking sign interpreter. Analyze the parking sign in the image and provide a detailed interpretation.
Current time context: ${time} on ${DAYS[dayOfWeek]}, ${date}

Analyze and provide the following information in a structured format:

1. Current Status:
   - Is parking currently allowed?
   - What are the current restrictions in effect?
   - Current time period's rules

2. Time Periods:
   - List all time periods mentioned
   - Rules for each period
   - Special conditions (if any)

3. Rates and Duration:
   - Maximum parking duration
   - Parking rates
   - Time limits
   - Meter information

4. Special Rules:
   - Holiday exceptions
   - Permit holder rules
   - Loading zone rules
   - Street cleaning
   - Special event restrictions

5. Next Available Period:
   - When parking will next be allowed
   - Duration and rates for next period

Format your response in JSON:
{
  "currentStatus": {
    "isAllowed": boolean,
    "currentRestriction": string,
    "timeRange": string
  },
  "timePeriods": {
    "weekdays": [
      {
        "timeRange": string,
        "rules": string[],
        "isNoParking": boolean
      }
    ],
    "weekends": [
      {
        "timeRange": string,
        "rules": string[],
        "isNoParking": boolean
      }
    ]
  },
  "parkingDetails": {
    "maxDuration": string,
    "mustLeaveBy": string,
    "parkingRate": string,
    "meterDetails": string
  },
  "specialRules": {
    "holidays": string[],
    "permits": string[],
    "loadingZone": string,
    "streetCleaning": string,
    "specialEvents": string[]
  },
  "nextAvailable": {
    "time": string,
    "rules": string[],
    "duration": string,
    "rate": string
  },
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
          max_tokens: 1000,
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

      return {
        ...parsedResult,
        isAllowed: parsedResult.currentStatus.isAllowed,
        maxDuration: parsedResult.parkingDetails.maxDuration,
        mustLeaveBy: parsedResult.parkingDetails.mustLeaveBy,
        parkingRate: parsedResult.parkingDetails.parkingRate,
      };
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
