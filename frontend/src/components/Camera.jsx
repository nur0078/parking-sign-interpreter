import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  CameraIcon,
  ArrowPathIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  SunIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

const Camera = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [flashMode, setFlashMode] = useState("off");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showGuide, setShowGuide] = useState(true);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const initializeCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode,
          advanced: [
            { zoom: zoomLevel },
            { brightness: { ideal: 100 } },
            { focusMode: "continuous" },
          ],
        },
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsInitializing(false);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsInitializing(false);
    }
  };

  const handleCapture = () => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    onCapture(imageData);
  };

  const toggleFlash = () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    const capabilities = track.getCapabilities();

    if (capabilities.torch) {
      const newMode = flashMode === "off" ? "on" : "off";
      track.applyConstraints({
        advanced: [{ torch: newMode === "on" }],
      });
      setFlashMode(newMode);
    }
  };

  const adjustZoom = (increment) => {
    const newZoom = Math.max(1, Math.min(5, zoomLevel + increment));
    setZoomLevel(newZoom);

    if (stream) {
      const track = stream.getVideoTracks()[0];
      track.applyConstraints({
        advanced: [{ zoom: newZoom }],
      });
    }
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  return (
    <div className="relative">
      {/* Camera Preview */}
      <div className="relative aspect-[3/4] max-w-md mx-auto overflow-hidden rounded-lg">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted
        />

        {/* Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full grid grid-cols-3 grid-rows-3">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="border border-white/20" />
            ))}
          </div>
        </div>

        {/* Capture Guide */}
        {showGuide && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white p-4">
            <div className="text-center max-w-xs">
              <h3 className="font-bold mb-2">Capture Tips</h3>
              <ul className="text-sm space-y-2">
                <li>• Center the parking sign in frame</li>
                <li>• Ensure good lighting</li>
                <li>• Hold steady and parallel to sign</li>
                <li>• Include all text clearly</li>
              </ul>
              <button
                onClick={() => setShowGuide(false)}
                className="mt-4 bg-white/20 px-4 py-2 rounded-full text-sm"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isInitializing && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <button
          onClick={() => adjustZoom(-0.5)}
          className="p-2 rounded-full bg-gray-800 text-white"
          title="Zoom Out"
        >
          <MagnifyingGlassMinusIcon className="h-6 w-6" />
        </button>

        <button
          onClick={handleCapture}
          className="p-4 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          title="Take Photo"
        >
          <CameraIcon className="h-8 w-8" />
        </button>

        <button
          onClick={() => adjustZoom(0.5)}
          className="p-2 rounded-full bg-gray-800 text-white"
          title="Zoom In"
        >
          <MagnifyingGlassPlusIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Secondary Controls */}
      <div className="mt-4 flex items-center justify-center space-x-4">
        <button
          onClick={toggleFlash}
          className={`p-2 rounded-full ${
            flashMode === "on" ? "bg-yellow-500" : "bg-gray-800"
          } text-white`}
          title="Toggle Flash"
        >
          <SunIcon className="h-5 w-5" />
        </button>

        <button
          onClick={toggleCamera}
          className="p-2 rounded-full bg-gray-800 text-white"
          title="Switch Camera"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>

        <button
          onClick={() => setShowGuide(true)}
          className="p-2 rounded-full bg-gray-800 text-white"
          title="Show Guide"
        >
          <PhotoIcon className="h-5 w-5" />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

Camera.propTypes = {
  onCapture: PropTypes.func.isRequired,
};

export default Camera;
