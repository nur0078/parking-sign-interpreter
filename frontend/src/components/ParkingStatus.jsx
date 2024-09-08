import PropTypes from "prop-types";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

const ParkingStatus = ({ interpretation }) => {
  const isAllowed =
    interpretation.toLowerCase().includes("allowed") ||
    interpretation.toLowerCase().includes("permitted");

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
      <div className="flex items-center justify-center mb-4">
        {isAllowed ? (
          <CheckCircleIcon className="h-12 w-12 text-green-500" />
        ) : (
          <XCircleIcon className="h-12 w-12 text-red-500" />
        )}
      </div>
      <h2 className="text-2xl font-bold text-center mb-4">
        {isAllowed ? "Parking Allowed" : "Parking Not Allowed"}
      </h2>
      <p className="text-gray-600 text-center">{interpretation}</p>
    </div>
  );
};

ParkingStatus.propTypes = {
  interpretation: PropTypes.string.isRequired,
};

export default ParkingStatus;
