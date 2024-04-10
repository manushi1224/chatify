import moment from "moment";

const renderDate = (chat, dateNum, dates) => {
  const timestampDate = moment(
    chat.createdAt || new Date().toLocaleDateString,
    "YYYY-MM-DD"
  ).format("DD/MM/yyyy");
  const yesterday = moment().subtract(1, "day").format("DD/MM/yyyy");
  const todayDate = moment().format("DD/MM/yyyy");

  dates.add(dateNum);
  return (
    <span className="flex justify-center">
      <span className="bg-secondary-content rounded-xl px-3 py-1 text-sm">
        {timestampDate === todayDate
          ? "Today"
          : timestampDate === yesterday
          ? "Yesterday"
          : timestampDate}
      </span>
    </span>
  );
};

export default renderDate;
