import { useEffect, useState } from "react";
import { SCHEDULES_URL } from "./schedule.js";

const loadJson = (file) =>
  fetch(`${SCHEDULES_URL}${file}`).then((response) => {
    if (!response.ok) throw new Error(`Unable to load ${file}.`);
    return response.json();
  });

export function useCatalog() {
  const [catalog, setCatalog] = useState([]);
  const [defaultId, setDefaultId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadJson("index.json")
      .then((data) => {
        setCatalog(data.releases);
        setDefaultId(data.default ?? data.releases[0]?.id ?? "");
      })
      .catch((cause) => setError(cause.message));
  }, []);

  return { catalog, defaultId, error };
}

export function useRelease(catalog, releaseId) {
  const [release, setRelease] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const entry = catalog.find((item) => item.id === releaseId);
    if (!entry) return;

    let active = true;
    setRelease(null);
    loadJson(entry.file)
      .then((data) => active && setRelease(data))
      .catch((cause) => active && setError(cause.message));

    return () => {
      active = false;
    };
  }, [catalog, releaseId]);

  return { release, error };
}

export function useAllReleases(catalog) {
  const [releases, setReleases] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (catalog.length === 0) return;

    let active = true;
    Promise.all(catalog.map((entry) => loadJson(entry.file).then((data) => ({ ...data, id: entry.id }))))
      .then((data) => active && setReleases(data))
      .catch((cause) => active && setError(cause.message));

    return () => {
      active = false;
    };
  }, [catalog]);

  return { releases, error };
}
