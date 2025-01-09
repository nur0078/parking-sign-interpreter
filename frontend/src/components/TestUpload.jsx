import { useState } from "react";

const TestUpload = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result;

        // Send to backend
        const response = await fetch(
          "http://localhost:3000/api/interpret-sign",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64String }),
          }
        );

        const data = await response.json();
        setResult(data);
        console.log("Full API Response:", data);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error:", error);
      setResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Parking Sign Test</h1>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {loading && <div className="text-blue-600">Processing image...</div>}

      {result && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-bold mb-2">API Response:</h2>
          <pre className="whitespace-pre-wrap bg-white p-4 rounded border">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestUpload;
