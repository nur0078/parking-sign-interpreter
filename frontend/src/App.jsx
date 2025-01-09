import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Camera from "./components/Camera";
import ParkingStatus from "./components/ParkingStatus";
import { interpretParkingSign } from "./services/apiService";
import { formatDateTime } from "./utils/dateTime";
import { Button } from "./components/common/Button";
import { Card } from "./components/common/Card";
import {
  XCircleIcon,
  PhotoIcon,
  CheckCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [requestTime, setRequestTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [error, setError] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const CurrentDateTime = () => (
    <Card className="mt-4">
      <div className="flex items-center justify-center space-x-2">
        <ClockIcon className="h-5 w-5 text-blue-500" />
        <p className="text-gray-700 font-medium">
          {formatDateTime(currentDateTime)}
        </p>
      </div>
    </Card>
  );

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
      <Button onClick={handleReset} variant="error" className="mt-3 text-sm">
        Try Again
      </Button>
    </div>
  );

  ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired,
  };

  const UploadButton = ({ icon: Icon, label, onClick }) => (
    <Button
      onClick={onClick}
      variant="outline"
      icon={Icon}
      className="w-full p-4 mb-3"
    >
      {label}
    </Button>
  );

  UploadButton.propTypes = {
    icon: PropTypes.elementType.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  const MobileUpload = () => {
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileSelect = async (file) => {
      if (!file) return;

      // Reset any previous errors
      setError(null);

      // Log detailed file information
      console.log("📱 Mobile Upload Details:", {
        fileType: file.type,
        fileSize: Math.round(file.size / 1024) + "KB",
        fileName: file.name,
        lastModified: new Date(file.lastModified).toISOString(),
      });

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size too large. Please choose an image under 5MB.");
        setUploadStatus("error");
        return;
      }

      setUploadStatus("uploading");

      try {
        const reader = new FileReader();
        let isProcessing = false; // Add flag to prevent double processing

        reader.onloadend = async () => {
          if (isProcessing) return; // Skip if already processing
          isProcessing = true;

          const base64Data = reader.result;
          console.log("📸 Image Format Check:", {
            startsWithImage: base64Data.startsWith("data:image/"),
            mimeType: base64Data.split(";")[0],
            dataLength: base64Data.length,
          });

          if (!base64Data.startsWith("data:image/")) {
            setUploadStatus("error");
            setError("Invalid image format. Please select a valid image file.");
            return;
          }

          try {
            await handleCapture(base64Data);
            setUploadStatus("success");
          } catch (error) {
            console.error("❌ Error in image processing:", error);
            setUploadStatus("error");
            setError(
              error.message || "Failed to process the image. Please try again."
            );
          }
        };

        reader.onerror = () => {
          console.error("❌ FileReader error:", reader.error);
          setUploadStatus("error");
          setError("Failed to read the image file. Please try again.");
        };

        reader.readAsDataURL(file);
      } catch (error) {
        console.error("❌ File selection error:", error);
        setUploadStatus("error");
        setError("Failed to process the image. Please try again.");
      }
    };

    return (
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Upload Parking Sign Photo
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Choose how you&apos;d like to upload the parking sign photo
          </p>

          {!uploadStatus ? (
            <div className="space-y-3">
              <UploadButton
                icon={PhotoIcon}
                label="Upload Photo"
                onClick={() => {
                  // On mobile, this will show the standard interface with
                  // "Photo Library", "Take Photo", and "Choose File" options
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  // Don't set any capture attribute to get the standard interface
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
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Parking Sign Interpreter
          </h1>
          <p className="text-gray-600 mb-6">
            Take a photo of any parking sign to instantly understand the rules
          </p>
        </header>

        <main className="max-w-4xl mx-auto">
          {error && <ErrorMessage message={error} />}

          <div className="space-y-6">
            {!capturedImage ? (
              <>
                {isMobile ? (
                  <MobileUpload />
                ) : (
                  <Card>
                    <Camera onCapture={handleCapture} />
                  </Card>
                )}
                <CurrentDateTime />
              </>
            ) : (
              <div className="space-y-6">
                {!isMobile && (
                  <Card>
                    <img
                      src={capturedImage}
                      alt="Captured parking sign"
                      className="max-w-md mx-auto rounded-lg"
                    />
                  </Card>
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
                      <Button
                        onClick={handleReset}
                        className="px-6 py-2 rounded-full"
                      >
                        Scan Another Sign
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </main>

        <footer className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2024 Parking Sign Interpreter. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
