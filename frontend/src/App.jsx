import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Camera from "./components/Camera";
import ParkingStatus from "./components/ParkingStatus";
import TestUpload from "./components/TestUpload";
import { interpretParkingSign } from "./services/apiService";
import {
  XCircleIcon,
  PhotoIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [requestTime, setRequestTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      setIsMobile(mobileRegex.test(userAgent.toLowerCase()));
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleCapture = async (imageSrc) => {
    setError(null);
    setCapturedImage(imageSrc);
    setIsLoading(true);
    try {
      console.log("📸 Processing image...");
      const result = await interpretParkingSign(imageSrc);
      console.log("✅ Received interpretation:", result);
      setInterpretation(result.interpretation);
      setRequestTime(result.requestTime);
    } catch (error) {
      console.error("❌ Error:", error);
      setError(error.message);
      setInterpretation(null);
      setRequestTime(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCapturedImage(null);
    setInterpretation(null);
    setRequestTime(null);
    setError(null);
  };

  const ErrorMessage = ({ message }) => (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
      <div className="flex items-center">
        <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
        <p className="text-red-700">{message}</p>
      </div>
      <button
        onClick={handleReset}
        className="mt-3 text-sm text-red-600 hover:text-red-500"
      >
        Try Again
      </button>
    </div>
  );

  ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
  };

  const MobileUpload = () => {
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileSelect = async (file) => {
      if (!file) return;

      // Log detailed file information
      console.log("📱 Mobile Upload Details:", {
        fileType: file.type,
        fileSize: Math.round(file.size / 1024) + "KB",
        fileName: file.name,
        lastModified: new Date(file.lastModified).toISOString(),
      });

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please choose an image under 5MB.");
        return;
      }

      setUploadStatus("uploading");

      try {
        const reader = new FileReader();

        reader.onloadend = async () => {
          try {
            const base64Data = reader.result;
            console.log("📸 Image Format Check:", {
              startsWithImage: base64Data.startsWith("data:image/"),
              mimeType: base64Data.split(";")[0],
              dataLength: base64Data.length,
              truncatedData: base64Data.substring(0, 100) + "...", // Show start of data
            });

            if (!base64Data.startsWith("data:image/")) {
              throw new Error(
                "Invalid image format. Please select a valid image file."
              );
            }

            setUploadStatus("success");
            console.log("🚀 Attempting handleCapture...");
            await handleCapture(base64Data);
          } catch (error) {
            console.error("❌ Error in image processing:", {
              errorMessage: error.message,
              errorName: error.name,
              errorStack: error.stack,
            });
            setUploadStatus("error");
            setError(
              error.message || "Failed to process the image. Please try again."
            );
          }
        };

        reader.onerror = () => {
          console.error("❌ FileReader error:", {
            error: reader.error,
            errorCode: reader.error?.code,
            state: reader.readyState,
          });
          setUploadStatus("error");
          setError("Failed to read the image file. Please try again.");
        };

        console.log("📖 Starting file read...");
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("❌ File selection error:", {
          errorType: error.name,
          errorMessage: error.message,
          errorStack: error.stack,
        });
        setUploadStatus("error");
        setError("Failed to process the image. Please try again.");
      }
    };

    const UploadButton = ({ icon: Icon, label, onClick, mode }) => (
      <button
        onClick={onClick}
        className="flex items-center justify-center w-full p-4 mb-3 bg-white border-2 border-blue-100 rounded-xl hover:bg-blue-50 transition-colors"
      >
        <Icon className="h-6 w-6 text-blue-500 mr-2" />
        <span className="text-blue-700 font-medium">{label}</span>
        {mode === "camera" && (
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
        )}
      </button>
    );

    UploadButton.propTypes = {
      icon: PropTypes.elementType.isRequired,
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func.isRequired,
      mode: PropTypes.oneOf(["camera", "library", "file"]),
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Parking Sign Photo
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Choose how you'd like to upload the parking sign photo
          </p>

          {!uploadStatus ? (
            <div className="space-y-3">
              <UploadButton
                icon={PhotoIcon}
                label="Choose from Library"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => handleFileSelect(e.target.files[0]);
                  input.click();
                }}
              />
            </div>
          ) : (
            <div className="text-center p-8">
              {uploadStatus === "uploading" ? (
                <div className="animate-pulse">
                  <div className="mx-auto h-12 w-12 mb-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                  <p className="text-gray-600">Uploading image...</p>
                </div>
              ) : uploadStatus === "success" ? (
                <div className="text-green-500">
                  <CheckCircleIcon className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-gray-600">Image uploaded successfully!</p>
                </div>
              ) : (
                <div className="text-red-500">
                  <XCircleIcon className="h-12 w-12 mx-auto mb-4" />
                  <p className="text-gray-600">Failed to upload image</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Parking Sign Interpreter
          </h1>
          <p className="text-gray-600 mb-6">
            Take a photo of any parking sign to instantly understand the rules
          </p>
          {/* Test mode button commented out for now */}
          {/* {!isMobile && (
            <button
              onClick={() => setShowTest(!showTest)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
            >
              {showTest ? "Use Camera" : "Test with Upload"}
            </button>
          )} */}
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {error && <ErrorMessage message={error} />}

          {/* Test upload component commented out */}
          {/* {!isMobile && showTest ? (
            <TestUpload />
          ) : ( */}
          <div className="space-y-6">
            {!capturedImage ? (
              isMobile ? (
                <MobileUpload />
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Camera onCapture={handleCapture} />
                </div>
              )
            ) : (
              <div className="space-y-6">
                {!isMobile && (
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <img
                      src={capturedImage}
                      alt="Captured parking sign"
                      className="max-w-md mx-auto rounded-lg"
                    />
                  </div>
                )}

                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Interpreting sign...</p>
                  </div>
                ) : (
                  <>
                    <ParkingStatus
                      interpretation={interpretation}
                      requestTime={requestTime}
                    />
                    <div className="text-center">
                      <button
                        onClick={handleReset}
                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
                      >
                        Scan Another Sign
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {/* )} */}
        </main>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 Parking Sign Interpreter. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
