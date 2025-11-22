// backend/utils/dateRange.js
export function computeRange(plan, startDateStr) {
  if (!startDateStr) throw new Error("startDate is required");

  const start = new Date(startDateStr); // expecting "YYYY-MM-DD"
  if (Number.isNaN(start.getTime())) {
    throw new Error("Invalid startDate format");
  }

  const end = new Date(start);

  if (plan === "daily") {
    // same day
  } else if (plan === "weekly") {
    end.setDate(end.getDate() + 6); // 7-day range
  } else if (plan === "monthly") {
    // one month window
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);
  } else {
    throw new Error("Invalid plan");
  }

  // normalize times
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}
