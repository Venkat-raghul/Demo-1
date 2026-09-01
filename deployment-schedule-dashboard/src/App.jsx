import { useCallback, useEffect, useState } from "react";
import CalendarPage from "./CalendarPage.jsx";
import SchedulePage from "./SchedulePage.jsx";
import { CalendarIcon, ListIcon, MoonIcon, SunIcon } from "./icons.jsx";
import { useCatalog } from "./useSchedules.js";
import "./App.css";

const routeFromHash = () => {
  const [path, search] = window.location.hash.replace(/^#\/?/, "").split("?");
  const params = new URLSearchParams(search ?? "");
  return {
    name: path === "calendar" ? "calendar" : "schedule",
    date: params.get("date") ?? "",
    release: params.get("release") ?? ""
  };
};

const initialTheme = () => {
  const stored = localStorage.getItem("theme");
  return stored === "dark" ? "dark" : "light";
};

export default function App() {
  const { catalog, defaultId, error: catalogError } = useCatalog();
  const [releaseId, setReleaseId] = useState("");
  const [error, setError] = useState("");
  const [route, setRoute] = useState(routeFromHash);
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const sync = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  useEffect(() => {
    if (defaultId) setReleaseId(defaultId);
  }, [defaultId]);

  useEffect(() => {
    if (route.release) setReleaseId(route.release);
  }, [route.release]);

  const reportError = useCallback((message) => setError(message), []);
  const visibleError = catalogError || error;

  return (
    <main className="page">
      <div className="shell">
        <header className="header">
          <div className="header-meta">
            <span className="badge badge-accent">Release Calendar</span>
            <span className="muted">Times shown in IST</span>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
              <span>{theme === "dark" ? "Light" : "Dark"}</span>
            </button>
          </div>
          <h1>SWAT Deployment Schedule</h1>
          <p className="lede">A single view for cycle deployments and production release windows.</p>
          <nav className="nav">
            <a className={route.name === "schedule" ? "nav-link nav-active" : "nav-link"} href="#/schedule">
              <ListIcon />
              <span>Schedule</span>
            </a>
            <a className={route.name === "calendar" ? "nav-link nav-active" : "nav-link"} href="#/calendar">
              <CalendarIcon />
              <span>Calendar</span>
            </a>
          </nav>
        </header>

        {visibleError && <div className="alert">{visibleError}</div>}

        {route.name === "calendar" ? (
          <CalendarPage catalog={catalog} onError={reportError} />
        ) : (
          <SchedulePage
            catalog={catalog}
            releaseId={releaseId}
            focusDate={route.date}
            onReleaseChange={setReleaseId}
            onError={reportError}
          />
        )}
      </div>
    </main>
  );
}
