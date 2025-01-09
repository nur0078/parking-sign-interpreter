import PropTypes from "prop-types";
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  BellAlertIcon,
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

const RulesList = ({ rules, title }) => {
  if (!rules?.length) return null;
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-700 mb-2">{title}</h4>
      <ul className="space-y-1">
        {rules.map((rule, index) => (
          <li
            key={index}
            className="text-sm text-gray-600 flex items-center space-x-2"
          >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
            <span>{rule}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TimePeriodCard = ({ period, isWeekend }) => {
  if (!period) return null;
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-700 mb-2">
        {isWeekend ? "Weekend" : "Weekday"} - {period.timeRange}
      </h4>
      <div className="space-y-2">
        {period.rules.map((rule, index) => (
          <div key={index} className="flex items-center space-x-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                period.isNoParking ? "bg-red-500" : "bg-green-500"
              }`}
            ></span>
            <span>{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ParkingStatus = ({ interpretation, requestTime }) => {
  if (!interpretation) return null;

  const {
    currentStatus,
    timePeriods,
    parkingDetails,
    specialRules,
    nextAvailable,
    explanation,
  } = interpretation;

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
          currentStatus.isAllowed
            ? "from-green-50 to-green-100"
            : "from-red-50 to-red-100"
        }`}
      >
        <div className="text-center">
          {currentStatus.isAllowed ? (
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          <h2
            className={`text-2xl font-bold ${
              currentStatus.isAllowed ? "text-green-700" : "text-red-700"
            }`}
          >
            {currentStatus.isAllowed
              ? "Parking Allowed"
              : "Parking Not Allowed"}
          </h2>
          <p className="text-gray-600 mt-2">
            {currentStatus.currentRestriction}
          </p>
          {currentTimeInfo && (
            <p className="text-gray-500 mt-2 text-sm">
              Current time: {currentTimeInfo}
            </p>
          )}
        </div>
      </div>

      {/* Current Period Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          icon={ClockIcon}
          title="Maximum Duration"
          value={parkingDetails.maxDuration}
          color="blue"
        />
        <InfoCard
          icon={CalendarIcon}
          title="Must Leave By"
          value={parkingDetails.mustLeaveBy}
          color="yellow"
        />
        <InfoCard
          icon={CurrencyDollarIcon}
          title="Parking Rate"
          value={parkingDetails.parkingRate}
          color="green"
        />
        <InfoCard
          icon={ExclamationTriangleIcon}
          title="Meter Details"
          value={parkingDetails.meterDetails}
          color="purple"
        />
      </div>

      {/* Time Periods */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-3">Time Periods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timePeriods.weekdays?.map((period, index) => (
            <TimePeriodCard
              key={`weekday-${index}`}
              period={period}
              isWeekend={false}
            />
          ))}
          {timePeriods.weekends?.map((period, index) => (
            <TimePeriodCard
              key={`weekend-${index}`}
              period={period}
              isWeekend={true}
            />
          ))}
        </div>
      </div>

      {/* Special Rules */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-3">Special Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RulesList rules={specialRules.holidays} title="Holiday Rules" />
            <RulesList rules={specialRules.permits} title="Permit Rules" />
          </div>
          <div>
            <RulesList
              rules={specialRules.specialEvents}
              title="Special Events"
            />
            {specialRules.loadingZone && (
              <InfoCard
                icon={TruckIcon}
                title="Loading Zone"
                value={specialRules.loadingZone}
                color="orange"
              />
            )}
            {specialRules.streetCleaning && (
              <InfoCard
                icon={BellAlertIcon}
                title="Street Cleaning"
                value={specialRules.streetCleaning}
                color="red"
              />
            )}
          </div>
        </div>
      </div>

      {/* Next Available Period */}
      {nextAvailable && (
        <div className="border-t pt-4">
          <h3 className="font-semibold text-gray-700 mb-3">
            Next Available Parking
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoCard
                icon={ClockIcon}
                title="Available From"
                value={nextAvailable.time}
                color="blue"
              />
              <InfoCard
                icon={CurrencyDollarIcon}
                title="Rate"
                value={nextAvailable.rate}
                color="green"
              />
            </div>
            <RulesList rules={nextAvailable.rules} title="Applicable Rules" />
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-700 mb-2">Summary</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{explanation}</p>
      </div>

      {/* Time Stamp */}
      <div className="text-center text-xs text-gray-400 mt-4">
        Last updated: {new Date().toLocaleString()}
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

RulesList.propTypes = {
  rules: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired,
};

TimePeriodCard.propTypes = {
  period: PropTypes.shape({
    timeRange: PropTypes.string.isRequired,
    rules: PropTypes.arrayOf(PropTypes.string).isRequired,
    isNoParking: PropTypes.bool.isRequired,
  }),
  isWeekend: PropTypes.bool.isRequired,
};

ParkingStatus.propTypes = {
  interpretation: PropTypes.shape({
    currentStatus: PropTypes.shape({
      isAllowed: PropTypes.bool.isRequired,
      currentRestriction: PropTypes.string.isRequired,
      timeRange: PropTypes.string.isRequired,
    }),
    timePeriods: PropTypes.shape({
      weekdays: PropTypes.arrayOf(
        PropTypes.shape({
          timeRange: PropTypes.string.isRequired,
          rules: PropTypes.arrayOf(PropTypes.string).isRequired,
          isNoParking: PropTypes.bool.isRequired,
        })
      ),
      weekends: PropTypes.arrayOf(
        PropTypes.shape({
          timeRange: PropTypes.string.isRequired,
          rules: PropTypes.arrayOf(PropTypes.string).isRequired,
          isNoParking: PropTypes.bool.isRequired,
        })
      ),
    }),
    parkingDetails: PropTypes.shape({
      maxDuration: PropTypes.string,
      mustLeaveBy: PropTypes.string,
      parkingRate: PropTypes.string,
      meterDetails: PropTypes.string,
    }),
    specialRules: PropTypes.shape({
      holidays: PropTypes.arrayOf(PropTypes.string),
      permits: PropTypes.arrayOf(PropTypes.string),
      loadingZone: PropTypes.string,
      streetCleaning: PropTypes.string,
      specialEvents: PropTypes.arrayOf(PropTypes.string),
    }),
    nextAvailable: PropTypes.shape({
      time: PropTypes.string,
      rules: PropTypes.arrayOf(PropTypes.string),
      duration: PropTypes.string,
      rate: PropTypes.string,
    }),
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
