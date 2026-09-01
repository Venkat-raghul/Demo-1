import { useEffect, useMemo, useState } from "react";
import { CalendarIcon, ClockIcon, RocketIcon, ServerIcon, SearchIcon } from "./icons.jsx";
import { displayDate, eventTime, flatten } from "./schedule.js";
import { useRelease } from "./useSchedules.js";

export default function SchedulePage({ catalog, releaseId, focusDate, onReleaseChange, onError }) {
  const { release, error } = useRelease(catalog, releaseId);
  const [query, setQuery] = useState("");
  const [service, setService] = useState("all");
  const [view, setView] = useState("upcoming");
  const now = Date.now();

  useEffect(() => {
    if (error) onError(error);
  }, [error, onError]);

  useEffect(() => setService("all"), [releaseId]);

  // Arriving from a calendar day should show that day in full, not just what is still upcoming.
  useEffect(() => {
    if (focusDate) {
      setView("all");
      setQuery("");
    }
  }, [focusDate]);

  const allEvents = useMemo(() => flatten(release), [release]);

  const events = useMemo(
    () =>
      allEvents
        .filter((item) => service === "all" || item.service === service)
        .filter((item) => item.service.toLowerCase().includes(query.trim().toLowerCase()))
        .filter((item) => (focusDate ? item.date === focusDate : true))
        .filter((item) =>
          view === "all" ? true : view === "upcoming" ? eventTime(item) >= now : eventTime(item) < now
        )
        .sort((a, b) => eventTime(a) - eventTime(b)),
    [allEvents, query, service, view, focusDate, now]
  );

  const nextEvent = useMemo(
    () => allEvents.filter((item) => eventTime(item) >= now).sort((a, b) => eventTime(a) - eventTime(b))[0],
    [allEvents, now]
  );

  return (
    <>
      {focusDate && (
        <div className="focus-note">
          <span>
            Showing deployments for <strong>{displayDate(focusDate)}</strong>
          </span>
          <span className="focus-actions">
            <a className="tab" href="#/schedule">
              Show all dates
            </a>
            <a className="tab" href="#/calendar">
              Back to calendar
            </a>
          </span>
        </div>
      )}

      <section className="summary">
        <article className="card">
          <div className="card-label accent-cyan">
            <RocketIcon />
            <span>Current release</span>
          </div>
          <select
            className="release-select"
            value={releaseId}
            onChange={(event) => onReleaseChange(event.target.value)}
          >
            {catalog.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          {release?.cycle_date_range && (
            <div className="muted small">
              Cycles {displayDate(release.cycle_date_range.start)} &ndash;{" "}
              {displayDate(release.cycle_date_range.end)}
            </div>
          )}
        </article>

        <article className="card">
          <div className="card-label accent-violet">
            <CalendarIcon />
            <span>Production dates</span>
          </div>
          <div className="stack">
            {release ? (
              release.prod_release_dates.map((date) => (
                <div key={date} className="strong">
                  {displayDate(date)}
                </div>
              ))
            ) : (
              <div className="muted">Loading&hellip;</div>
            )}
          </div>
        </article>

        <article className="card">
          <div className="card-label accent-emerald">
            <ClockIcon />
            <span>Next deployment</span>
          </div>
          {!release ? (
            <div className="muted">Loading&hellip;</div>
          ) : nextEvent ? (
            <>
              <div className="strong">
                {nextEvent.service} &middot; Cycle {nextEvent.cycle}
              </div>
              <div className="muted small">
                {displayDate(nextEvent.date)} at {nextEvent.time_IST} IST
              </div>
            </>
          ) : (
            <div className="muted">No upcoming deployments</div>
          )}
        </article>
      </section>

      <section className="card filters">
        <div className="search">
          <SearchIcon />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search service..."
          />
        </div>
        <select value={service} onChange={(event) => setService(event.target.value)}>
          <option value="all">All services</option>
          {Object.keys(release?.release_cycles ?? {}).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <div className="tabs">
          {["upcoming", "past", "all"].map((option) => (
            <button
              key={option}
              type="button"
              className={view === option ? "tab tab-active" : "tab"}
              onClick={() => setView(option)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </section>

      <section className="list">
        {events.map((item) => (
          <article className="card row" key={`${item.service}-${item.cycle}-${item.date}`}>
            <div className="row-service">
              <span className="icon-chip">
                <ServerIcon />
              </span>
              <div>
                <div className="strong">{item.service}</div>
                <div className="muted small">Cycle deployment</div>
              </div>
            </div>
            <span className="badge badge-outline">Cycle {item.cycle}</span>
            <div>
              <div className="strong">{displayDate(item.date)}</div>
              <div className="muted small">{item.time_IST} IST</div>
            </div>
            <span className={eventTime(item) >= now ? "badge badge-planned" : "badge badge-past"}>
              {eventTime(item) >= now ? "Planned" : "Past"}
            </span>
          </article>
        ))}
        {!release && !error && <div className="empty">Loading schedule&hellip;</div>}
        {release && events.length === 0 && (
          <div className="empty">No deployments match the current filters.</div>
        )}
      </section>
    </>
  );
}
