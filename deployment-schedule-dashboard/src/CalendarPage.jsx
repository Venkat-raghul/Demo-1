import { useEffect, useMemo, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons.jsx";
import { WEEKDAYS, flatten, monthLabel, monthMatrix, shiftMonth, todayKey } from "./schedule.js";
import { useAllReleases } from "./useSchedules.js";

const startOfMonth = () => {
  const [year, month] = todayKey().split("-");
  return { year: Number(year), month: Number(month) - 1 };
};

export default function CalendarPage({ catalog, onError }) {
  const { releases, error } = useAllReleases(catalog);
  const [cursor, setCursor] = useState(startOfMonth);
  const [service, setService] = useState("all");
  const today = todayKey();

  useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);

  const services = useMemo(
    () =>
      [...new Set(releases.flatMap((release) => Object.keys(release.release_cycles ?? {})))].sort(),
    [releases]
  );

  const byDate = useMemo(() => {
    const map = new Map();
    const push = (date, entry) => map.set(date, [...(map.get(date) ?? []), entry]);

    releases.forEach((release) => {
      flatten(release).forEach((item) => {
        if (service !== "all" && item.service !== service) return;
        push(item.date, { ...item, release: release.name, releaseId: release.id, kind: "cycle" });
      });
      (release.prod_release_dates ?? []).forEach((date) =>
        push(date, {
          date,
          service: "Production release",
          release: release.name,
          releaseId: release.id,
          kind: "prod"
        })
      );
    });

    map.forEach((entries) =>
      entries.sort((a, b) => (a.kind === b.kind ? (a.time_IST ?? "").localeCompare(b.time_IST ?? "") : a.kind === "prod" ? -1 : 1))
    );
    return map;
  }, [releases, service]);

  const weeks = useMemo(() => monthMatrix(cursor.year, cursor.month), [cursor]);

  const monthCount = useMemo(() => {
    const prefix = `${cursor.year}-${String(cursor.month + 1).padStart(2, "0")}`;
    return [...byDate.entries()]
      .filter(([date]) => date.startsWith(prefix))
      .reduce((total, [, entries]) => total + entries.length, 0);
  }, [byDate, cursor]);

  const move = (delta) => setCursor((current) => shiftMonth(current.year, current.month, delta));

  const openDate = (key, entries) => {
    const releaseId = entries.find((entry) => entry.kind === "cycle")?.releaseId ?? entries[0].releaseId;
    window.location.hash = `#/schedule?date=${key}&release=${releaseId}`;
  };

  return (
    <>
      <section className="card calendar-toolbar">
        <div className="month-nav">
          <button type="button" className="icon-button" onClick={() => move(-1)} aria-label="Previous month">
            <ChevronLeftIcon />
          </button>
          <h2>{monthLabel(cursor.year, cursor.month)}</h2>
          <button type="button" className="icon-button" onClick={() => move(1)} aria-label="Next month">
            <ChevronRightIcon />
          </button>
          <button type="button" className="tab" onClick={() => setCursor(startOfMonth())}>
            Today
          </button>
        </div>

        <select value={service} onChange={(event) => setService(event.target.value)}>
          <option value="all">All services</option>
          {services.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <div className="legend">
          <span className="legend-item">
            <span className="legend-dot dot-prod" /> Production
          </span>
          <span className="legend-item">
            <span className="legend-dot dot-cycle" /> Cycle
          </span>
          <span className="muted small">{monthCount} scheduled &middot; select a day to see the list</span>
        </div>
      </section>

      {releases.length === 0 && !error ? (
        <div className="empty">Loading calendar&hellip;</div>
      ) : (
        <section className="card calendar">
          <div className="calendar-head">
            {WEEKDAYS.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-grid">
            {weeks.flat().map((cell, index) => {
              if (!cell) return <div key={`pad-${index}`} className="calendar-cell cell-pad" />;
              const entries = byDate.get(cell.key) ?? [];
              const classes = ["calendar-cell"];
              if (cell.key === today) classes.push("cell-today");
              if (entries.length > 0) classes.push("cell-active");

              return (
                <button
                  type="button"
                  key={cell.key}
                  className={classes.join(" ")}
                  disabled={entries.length === 0}
                  title={entries.length > 0 ? `View ${entries.length} scheduled deployment(s)` : undefined}
                  onClick={() => openDate(cell.key, entries)}
                >
                  <span className="day-number">{cell.day}</span>
                  <span className="chips">
                    {entries.slice(0, 3).map((entry, position) => (
                      <span
                        key={`${entry.service}-${entry.cycle ?? "prod"}-${position}`}
                        className={entry.kind === "prod" ? "chip chip-prod" : "chip"}
                      >
                        {entry.kind === "prod" ? "Production" : entry.service}
                      </span>
                    ))}
                    {entries.length > 3 && <span className="chip chip-more">+{entries.length - 3} more</span>}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
