import { Priority } from "@prisma/client";
import { differenceInMinutes } from "date-fns";
import { addBusinessMinutes } from "./businessHours";

export type SlaState = "ON_TRACK" | "AT_RISK" | "BREACHED";

const SLA_POLICY: Record<
  Priority,
  { firstResponseMinutes: number; resolutionMinutes: number }
> = {
  URGENT: {
    firstResponseMinutes: 60,
    resolutionMinutes: 240,
  },
  HIGH: {
    firstResponseMinutes: 240,
    resolutionMinutes: 1440,
  },
  MEDIUM: {
    firstResponseMinutes: 480,
    resolutionMinutes: 2880,
  },
  LOW: {
    firstResponseMinutes: 1440,
    resolutionMinutes: 4320,
  },
};

export function calculateSlaDeadline(
  createdAt: Date,
  priority: Priority,
  type: "FIRST_RESPONSE" | "RESOLUTION",
  holidays: Date[]
): Date {
  const minutes =
    type === "FIRST_RESPONSE"
      ? SLA_POLICY[priority].firstResponseMinutes
      : SLA_POLICY[priority].resolutionMinutes;

  return addBusinessMinutes(createdAt, minutes, holidays);
}

export function getSlaState(
  deadline: Date,
  totalSlaMinutes: number,
  now: Date
): SlaState {
  const remainingMinutes = differenceInMinutes(deadline, now);

  if (remainingMinutes <= 0) {
    return "BREACHED";
  }

  const consumedMinutes = totalSlaMinutes - remainingMinutes;
  const consumedPercentage = consumedMinutes / totalSlaMinutes;

  if (consumedPercentage > 0.75) {
    return "AT_RISK";
  }

  return "ON_TRACK";
}