import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

function Camera({ onCapture }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const stopStream = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => {
        track.stop();
        streamRef.current.removeTrack(track);
      });
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setIsInitialized(false);
    }
  };

  useEffect(() => {
    const isMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase()
      );
    };

    const initializeCamera = async () => {
      // Don't initialize camera on mobile devices
      if (isMobileDevice()) {
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
      }
    };

    initializeCamera();

    // Cleanup function
    return () => {
      stopStream();
    };
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !isInitialized) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/jpeg");

    // Stop the stream immediately after capturing
    stopStream();

    onCapture(imageData);
  };

  return (
    <div className="relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg"
      />
      <button
        onClick={handleCapture}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
      >
        Take Photo
      </button>
    </div>
  );
}

Camera.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default Camera;
