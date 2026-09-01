const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};

export const RocketIcon = () => (
  <svg {...base}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2Z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

export const CalendarIcon = () => (
  <svg {...base}>
    <path d="M8 2v4M16 2v4M3 10h18" />
    <rect x="3" y="4" width="18" height="18" rx="2" />
  </svg>
);

export const ClockIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const ServerIcon = () => (
  <svg {...base}>
    <rect x="2" y="3" width="20" height="8" rx="2" />
    <rect x="2" y="13" width="20" height="8" rx="2" />
    <path d="M6 7h.01M6 17h.01" />
  </svg>
);

export const SearchIcon = () => (
  <svg {...base}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const SunIcon = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);

export const MoonIcon = () => (
  <svg {...base}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const ChevronLeftIcon = () => (
  <svg {...base}>
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export const ChevronRightIcon = () => (
  <svg {...base}>
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export const ListIcon = () => (
  <svg {...base}>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
