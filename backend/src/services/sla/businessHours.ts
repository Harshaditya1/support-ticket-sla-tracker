import {
  addDays,
  addMinutes,
  differenceInMinutes,
  setHours,
  setMinutes,
  setSeconds,
  setMilliseconds,
} from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

const BUSINESS_TIMEZONE =
  process.env.BUSINESS_TIMEZONE || "Asia/Kolkata";

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
    const holidayDate = toZonedTime(holiday, BUSINESS_TIMEZONE);

    return (
      holidayDate.getFullYear() === indiaDate.getFullYear() &&
      holidayDate.getMonth() === indiaDate.getMonth() &&
      holidayDate.getDate() === indiaDate.getDate()
    );
  });

  return !isHoliday;
}

export function nextBusinessStart(
  date: Date,
  holidays: Date[]
): Date {
  let indiaDate = toZonedTime(date, BUSINESS_TIMEZONE);

  while (true) {
    // Skip weekends and holidays
    if (!isBusinessDay(fromZonedTime(indiaDate, BUSINESS_TIMEZONE), holidays)) {
      indiaDate = addDays(indiaDate, 1);
      indiaDate = setHours(indiaDate, 9);
      indiaDate = setMinutes(indiaDate, 0);
      indiaDate = setSeconds(indiaDate, 0);
      indiaDate = setMilliseconds(indiaDate, 0);
      continue;
    }

    const hour = indiaDate.getHours();

    // Before business hours → same day 09:00
    if (hour < 9) {
      indiaDate = setHours(indiaDate, 9);
      indiaDate = setMinutes(indiaDate, 0);
      indiaDate = setSeconds(indiaDate, 0);
      indiaDate = setMilliseconds(indiaDate, 0);
    }

    // After business hours → next business day 09:00
    else if (hour >= 18) {
      indiaDate = addDays(indiaDate, 1);
      indiaDate = setHours(indiaDate, 9);
      indiaDate = setMinutes(indiaDate, 0);
      indiaDate = setSeconds(indiaDate, 0);
      indiaDate = setMilliseconds(indiaDate, 0);
      continue;
    }

    // Return UTC because DB stores UTC timestamps
    return fromZonedTime(indiaDate, BUSINESS_TIMEZONE);
  }
}
export function addBusinessMinutes(
  startTime: Date,
  minutesToAdd: number,
  holidays: Date[]
): Date {
  let current = nextBusinessStart(startTime, holidays);

  let remainingMinutes = minutesToAdd;

  while (remainingMinutes > 0) {
    const indiaCurrent = toZonedTime(current, BUSINESS_TIMEZONE);

    const businessEnd = setMilliseconds(
      setSeconds(
        setMinutes(
          setHours(indiaCurrent, 18),
          0
        ),
        0
      ),
      0
    );

    const availableToday = differenceInMinutes(
      businessEnd,
      indiaCurrent
    );

    if (remainingMinutes <= availableToday) {
      const deadline = addMinutes(indiaCurrent, remainingMinutes);

      return fromZonedTime(deadline, BUSINESS_TIMEZONE);
    }

    remainingMinutes -= availableToday;

    const nextDay = addDays(indiaCurrent, 1);

    current = nextBusinessStart(
      fromZonedTime(nextDay, BUSINESS_TIMEZONE),
      holidays
    );
  }

  return current;
}