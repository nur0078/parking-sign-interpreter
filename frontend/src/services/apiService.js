import axios from "axios";

const API_URL = "http://localhost:3000/api";

export const interpretParkingSign = async (imageData) => {
  try {
    const response = await axios.post(`${API_URL}/interpret-sign`, {
      image: imageData,
    });
    return response.data;
  } catch (error) {
    console.error("Error interpreting parking sign:", error);
    throw error;
  }
};
