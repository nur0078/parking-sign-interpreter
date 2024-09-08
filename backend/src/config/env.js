require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 3000,
  LLM_API_KEY: process.env.LLM_API_KEY,
  LLM_API_URL:
    process.env.LLM_API_URL || "https://api.openai.com/v1/chat/completions",
};
