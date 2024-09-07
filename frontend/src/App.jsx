import { useState } from "react";
import Camera from "./components/Camera";
import ParkingStatus from "./components/ParkingStatus";
import { interpretParkingSign } from "./services/apiService";

function App() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [interpretation, setInterpretation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCapture = async (imageSrc) => {
    setCapturedImage(imageSrc);
    setIsLoading(true);
    try {
      const result = await interpretParkingSign(imageSrc);
      setInterpretation(result.interpretation);
    } catch (error) {
      console.error("Error interpreting sign:", error);
      setInterpretation(
        "Failed to interpret the parking sign. Please try again."
      );
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setCapturedImage(null);
    setInterpretation(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Parking Sign Interpreter
      </h1>
      {!capturedImage ? (
        <Camera onCapture={handleCapture} />
      ) : (
        <div className="space-y-6">
          <img
            src={capturedImage}
            alt="Captured parking sign"
            className="max-w-md mx-auto rounded-lg shadow-lg"
          />
          {isLoading ? (
            <p className="text-center">Interpreting sign...</p>
          ) : (
            <>
              <ParkingStatus interpretation={interpretation} />
              <button
                onClick={handleReset}
                className="block mx-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
              >
                Scan Another Sign
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
