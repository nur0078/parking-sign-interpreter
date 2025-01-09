export const formatDateTime = (date) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return date.toLocaleString("en-US", options);
};

export const getCurrentDateTime = () => {
  const now = new Date();
  return {
    dayOfWeek: now.getDay(),
    hour: now.getHours(),
    minute: now.getMinutes(),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};
