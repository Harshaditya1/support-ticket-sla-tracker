import { toZonedTime } from "date-fns-tz";

const BUSINESS_TIMEZONE = process.env.BUSINESS_TIMEZONE || "Asia/Kolkata";

export function isBusinessDay(
  date: Date,
  holidays: Date[]
): boolean {
  const indiaDate = toZonedTime(date, BUSINESS_TIMEZONE);

  const day = indiaDate.getDay();

  // Sunday = 0, Saturday = 6
  if (day === 0 || day === 6) {
    return false;
  }

  const isHoliday = holidays.some((holiday) => {
    const holidayDate = toZonedTime(
      holiday,
      BUSINESS_TIMEZONE
    );

    return (
      holidayDate.getFullYear() === indiaDate.getFullYear() &&
      holidayDate.getMonth() === indiaDate.getMonth() &&
      holidayDate.getDate() === indiaDate.getDate()
    );
  });

  return !isHoliday;
}