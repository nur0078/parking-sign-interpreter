import { useLocation } from "react-router-dom";
import "./Result.css"; // Assuming you'll add CSS for styling

const Result = () => {
  const location = useLocation();
  const interpretation = location.state?.interpretation || "";

  const parseInterpretation = (text) => {
    const parts = text.split("### Summary:");
    if (parts.length === 2) {
      const detailedInfo = parts[0].trim();
      const summary = parts[1].trim();
      return { detailedInfo, summary };
    }
    return { detailedInfo: text, summary: "" };
  };

  const { detailedInfo, summary } = parseInterpretation(interpretation);

  return (
    <div className="result-container">
      <h1>Parking Sign Interpretation</h1>
      {summary && (
        <div className="summary-section">
          <h2>Summary</h2>
          <p>{summary}</p>
        </div>
      )}
      {detailedInfo && (
        <div className="details-section">
          <h2>Details</h2>
          <p>{detailedInfo}</p>
        </div>
      )}
    </div>
  );
};

export default Result;
