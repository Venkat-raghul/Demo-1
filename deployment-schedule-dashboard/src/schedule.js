export const SCHEDULES_URL = `${import.meta.env.BASE_URL}schedules/`;

export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const displayDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
    timeZone: "Asia/Kolkata"
  }).format(new Date(`${value}T00:00:00+05:30`));

export const eventTime = (event) => new Date(`${event.date}T${event.time_IST}:00+05:30`).getTime();

export const flatten = (release) =>
  Object.entries(release?.release_cycles ?? {}).flatMap(([service, cycles]) =>
    cycles.map((item) => ({ ...item, service }))
  );

export const dayKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

// "Today" as the operator in IST sees it, not as the browser's local clock sees it.
export const todayKey = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());

export const monthLabel = (year, month) =>
  new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month, 1))
  );

export const shiftMonth = (year, month, delta) => {
  const next = new Date(Date.UTC(year, month + delta, 1));
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() };
};

// Weeks of 7 cells, Monday first. Padding cells are null.
export const monthMatrix = (year, month) => {
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const total = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells = Array.from({ length: offset }, () => null);

  for (let day = 1; day <= total; day += 1) {
    cells.push({ day, key: dayKey(year, month, day) });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  return Array.from({ length: cells.length / 7 }, (_, week) => cells.slice(week * 7, week * 7 + 7));
};
