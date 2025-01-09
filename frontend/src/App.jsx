import { useState } from "react";
import Camera from "./components/Camera";
import ParkingStatus from "./components/ParkingStatus";
import TestUpload from "./components/TestUpload";
import { interpretParkingSign } from "./services/apiService";

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [requestTime, setRequestTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showTest, setShowTest] = useState(false);

  const handleCapture = async (imageSrc) => {
    setCapturedImage(imageSrc);
    setIsLoading(true);
    try {
      const result = await interpretParkingSign(imageSrc);
      setInterpretation(result.interpretation);
      setRequestTime(result.requestTime);
    } catch (error) {
      console.error("Error interpreting sign:", error);
      setInterpretation(null);
      setRequestTime(null);
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setInterpretation(null);
    setRequestTime(null);
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
          <button
            onClick={() => setShowTest(!showTest)}
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md"
          >
            {showTest ? "Use Camera" : "Test with Upload"}
          </button>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {showTest ? (
            <TestUpload />
          ) : (
            <div className="space-y-6">
              {!capturedImage ? (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <Camera onCapture={handleCapture} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    <img
                      src={capturedImage}
                      alt="Captured parking sign"
                      className="max-w-md mx-auto rounded-lg"
                    />
                  </div>

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
          )}
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
