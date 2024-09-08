import { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Webcam from "react-webcam";
import { CameraIcon } from "@heroicons/react/24/solid";

const Camera = ({ onCapture }) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    onCapture(imageSrc);
  }, [webcamRef, onCapture]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        className="w-full rounded-lg shadow-lg"
      />
      <button
        onClick={capture}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
      >
        <CameraIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

Camera.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default Camera;
