import PropTypes from "prop-types";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/solid";

const InfoCard = ({ icon: Icon, title, value, color }) => {
  if (!value) return null;
  return (
    <div
      className={`bg-${color}-50 p-4 rounded-lg shadow-sm border border-${color}-100`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-6 w-6 text-${color}-500`} />
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-${color}-700 font-semibold`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

InfoCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string,
  color: PropTypes.string.isRequired,
};

const ParkingStatus = ({ interpretation, requestTime }) => {
  if (!interpretation) return null;

  const { isAllowed, maxDuration, mustLeaveBy, parkingRate, explanation } =
    interpretation;

  // Format current time info
  const currentTimeInfo = requestTime
    ? `${requestTime.time} on ${new Date(requestTime.date).toLocaleDateString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      )}`
    : "";

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
      {/* Status Header */}
      <div
        className={`flex items-center justify-center p-6 rounded-lg bg-gradient-to-r ${
          isAllowed ? "from-green-50 to-green-100" : "from-red-50 to-red-100"
        }`}
      >
        <div className="text-center">
          {isAllowed ? (
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          <h2
            className={`text-2xl font-bold ${
              isAllowed ? "text-green-700" : "text-red-700"
            }`}
          >
            {isAllowed ? "Parking Allowed" : "Parking Not Allowed"}
          </h2>
          {currentTimeInfo && (
            <p className="text-gray-500 mt-2 text-sm">
              Current time: {currentTimeInfo}
            </p>
          )}
        </div>
      </div>

      {/* Parking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon={ClockIcon}
          title="Maximum Duration"
          value={maxDuration}
          color="blue"
        />
        <InfoCard
          icon={CalendarIcon}
          title="Must Leave By"
          value={mustLeaveBy}
          color="yellow"
        />
        <InfoCard
          icon={CurrencyDollarIcon}
          title="Parking Rate"
          value={parkingRate}
          color="green"
        />
        <InfoCard
          icon={ExclamationTriangleIcon}
          title="Additional Info"
          value={explanation}
          color="purple"
        />
      </div>

      {/* Detailed Rules */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-2">Detailed Rules</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{explanation}</p>
      </div>

      {/* Time Stamp */}
      <div className="text-center text-xs text-gray-400 mt-4">
        Last updated: {new Date().toLocaleString()}
      </div>
    </div>
  );
};

ParkingStatus.propTypes = {
  interpretation: PropTypes.shape({
    isAllowed: PropTypes.bool,
    maxDuration: PropTypes.string,
    mustLeaveBy: PropTypes.string,
    parkingRate: PropTypes.string,
    explanation: PropTypes.string,
  }),
  requestTime: PropTypes.shape({
    time: PropTypes.string,
    date: PropTypes.string,
    dayOfWeek: PropTypes.number,
    hour: PropTypes.number,
    minute: PropTypes.number,
  }),
};

export default ParkingStatus;
