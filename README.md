# Parking Sign Interpreter

A web application that leverages computer vision and natural language processing to interpret parking signs from images. The application dynamically assesses parking rules based on the captured sign and current time, providing users with accurate and actionable information.

## Features

- **Image Capture**: Easily capture parking sign images using a web camera.
- **Real-time Interpretation**: Analyze and interpret parking sign images to determine parking rules and restrictions.
- **Dynamic Rules Processing**: Adjust parking rules dynamically based on the current date and time.
- **Responsive Design**: Fully optimized for both desktop and mobile devices.

## Technologies Used

- **Frontend**:
  - React
  - Tailwind CSS
  - Vite

- **Backend**:
  - Node.js
  - Express
  - OpenAI API
  - Axios

## Usage

1. **Capture Image**: Use the camera component to take a photo of the parking sign.
2. **Interpret Sign**: The application sends the image to the backend, which uses the GPT-4 Vision API to interpret the sign.
3. **View Results**: The frontend displays whether parking is allowed or not, along with additional details and restrictions.
