// RouteX icons — minimal line set, 24x24, currentColor.
// Single style, 1.6 stroke, rounded caps/joins.

const Ico = ({ children, size = 18, style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const IcBus = (p) => <Ico {...p}>
  <rect x="4" y="4" width="16" height="13" rx="2.5" />
  <path d="M4 11h16" /><path d="M7 17v2" /><path d="M17 17v2" />
  <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" />
  <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
</Ico>;

const IcMap = (p) => <Ico {...p}>
  <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
  <path d="M9 4v14" /><path d="M15 6v14" />
</Ico>;

const IcDash = (p) => <Ico {...p}>
  <rect x="3" y="3" width="7" height="9" rx="1.5" />
  <rect x="14" y="3" width="7" height="5" rx="1.5" />
  <rect x="14" y="12" width="7" height="9" rx="1.5" />
  <rect x="3" y="16" width="7" height="5" rx="1.5" />
</Ico>;

const IcRoute = (p) => <Ico {...p}>
  <circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" />
  <path d="M6 17V9a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v0" />
  <path d="M18 7v8a4 4 0 0 1-4 4h-4" />
</Ico>;

const IcUsers = (p) => <Ico {...p}>
  <circle cx="9" cy="8" r="3.5" />
  <path d="M3 20c0-3 3-5 6-5s6 2 6 5" />
  <path d="M16 5.5a3 3 0 0 1 0 6" />
  <path d="M17 15c2 .5 4 2 4 5" />
</Ico>;

const IcBell = (p) => <Ico {...p}>
  <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5z" />
  <path d="M10 19a2 2 0 0 0 4 0" />
</Ico>;

const IcSettings = (p) => <Ico {...p}>
  <circle cx="12" cy="12" r="3" />
  <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
</Ico>;

const IcSearch = (p) => <Ico {...p}>
  <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
</Ico>;

const IcMobile = (p) => <Ico {...p}>
  <rect x="6" y="2" width="12" height="20" rx="2.5" />
  <path d="M11 18h2" />
</Ico>;

const IcUser = (p) => <Ico {...p}>
  <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
</Ico>;

const IcChev = (p) => <Ico {...p}><path d="m9 6 6 6-6 6" /></Ico>;
const IcChevDown = (p) => <Ico {...p}><path d="m6 9 6 6 6-6" /></Ico>;
const IcChevUp = (p) => <Ico {...p}><path d="m6 15 6-6 6 6" /></Ico>;

const IcClose = (p) => <Ico {...p}><path d="M6 6l12 12M18 6 6 18" /></Ico>;
const IcCheck = (p) => <Ico {...p}><path d="m5 12 5 5 9-11" /></Ico>;
const IcPlus = (p) => <Ico {...p}><path d="M12 5v14M5 12h14" /></Ico>;
const IcMore = (p) => <Ico {...p}><circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" /><circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none" /></Ico>;

const IcClock = (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>;
const IcPin = (p) => <Ico {...p}><path d="M12 22s7-7 7-13a7 7 0 1 0-14 0c0 6 7 13 7 13z" /><circle cx="12" cy="9" r="2.5" /></Ico>;
const IcNav = (p) => <Ico {...p}><path d="m22 2-7 20-3-9-9-3z" /></Ico>;
const IcPhone = (p) => <Ico {...p}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Ico>;
const IcMsg = (p) => <Ico {...p}><path d="M21 12a8 8 0 0 1-12 7l-5 1 1-5A8 8 0 1 1 21 12z" /></Ico>;

const IcShield = (p) => <Ico {...p}><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3z" /><path d="m9 12 2 2 4-4" /></Ico>;
const IcLogout = (p) => <Ico {...p}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="m10 17-5-5 5-5" /><path d="M5 12h12" /></Ico>;

const IcSun = (p) => <Ico {...p}><circle cx="12" cy="12" r="4" /><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" /></Ico>;
const IcMoon = (p) => <Ico {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></Ico>;

const IcAttn = (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><circle cx="12" cy="16.5" r="0.6" fill="currentColor" stroke="none" /></Ico>;
const IcHelp = (p) => <Ico {...p}><circle cx="12" cy="12" r="9" /><path d="M10 9a2 2 0 1 1 3 1.7c-.7.4-1 1-1 1.8M12 17v.5" /></Ico>;

const IcWalk = (p) => <Ico {...p}><circle cx="13" cy="4" r="1.5" /><path d="m10 22 3-7-2-4 3-2 3 4 3 1M7 13l3-5" /></Ico>;
const IcSpeed = (p) => <Ico {...p}><path d="M12 22a10 10 0 1 0-10-10" /><path d="m12 12 5-3" /></Ico>;
const IcWifi = (p) => <Ico {...p}><path d="M2 9a16 16 0 0 1 20 0" /><path d="M5 13a11 11 0 0 1 14 0" /><path d="M8.5 16.5a6 6 0 0 1 7 0" /><circle cx="12" cy="20" r="0.6" fill="currentColor" stroke="none" /></Ico>;
const IcBattery = (p) => <Ico {...p}><rect x="3" y="8" width="16" height="9" rx="2" /><path d="M21 11v3" /><rect x="5" y="10" width="9" height="5" fill="currentColor" stroke="none" /></Ico>;

const IcStar = (p) => <Ico {...p}><path d="m12 3 2.7 6 6.3.5-4.8 4.2 1.5 6.3L12 17l-5.7 3 1.5-6.3L3 9.5 9.3 9 12 3z" /></Ico>;
const IcDownload = (p) => <Ico {...p}><path d="M12 4v12" /><path d="m7 11 5 5 5-5" /><path d="M5 21h14" /></Ico>;
const IcFilter = (p) => <Ico {...p}><path d="M3 5h18" /><path d="M6 12h12" /><path d="M10 19h4" /></Ico>;
const IcSort = (p) => <Ico {...p}><path d="m7 4 0 14" /><path d="m4 15 3 3 3-3" /><path d="m17 20 0-14" /><path d="m20 9-3-3-3 3" /></Ico>;

const IcLeaf = (p) => <Ico {...p}><path d="M4 20c0-9 7-16 16-16 0 9-7 16-16 16z" /><path d="m4 20 9-9" /></Ico>;
const IcCamera = (p) => <Ico {...p}><path d="M4 7h3l2-2h6l2 2h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z" /><circle cx="12" cy="13" r="3.5" /></Ico>;
const IcLock = (p) => <Ico {...p}><rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V8a4 4 0 1 1 8 0v3" /></Ico>;
const IcMail = (p) => <Ico {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></Ico>;
const IcEye = (p) => <Ico {...p}><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></Ico>;
const IcTrendUp = (p) => <Ico {...p}><path d="M3 17 9 11l4 4 8-9" /><path d="M14 6h7v7" /></Ico>;
const IcTrendDown = (p) => <Ico {...p}><path d="M3 7 9 13l4-4 8 9" /><path d="M14 18h7v-7" /></Ico>;
const IcCalendar = (p) => <Ico {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Ico>;
const IcQR = (p) => <Ico {...p}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><path d="M14 14h3M14 17h7M14 20h3M17 17v4" /></Ico>;
const IcArrowR = (p) => <Ico {...p}><path d="M5 12h14M13 5l7 7-7 7" /></Ico>;
const IcArrowL = (p) => <Ico {...p}><path d="M19 12H5M11 5l-7 7 7 7" /></Ico>;
const IcWarn = (p) => <Ico {...p}><path d="m12 3 10 17H2L12 3z" /><path d="M12 10v4M12 17v.5" /></Ico>;
const IcFlag = (p) => <Ico {...p}><path d="M4 21V4" /><path d="M4 4h13l-2 4 2 4H4" /></Ico>;
const IcSettings2 = (p) => <Ico {...p}><path d="M4 6h11M19 6h1" /><circle cx="17" cy="6" r="2" /><path d="M4 12h6M14 12h6" /><circle cx="12" cy="12" r="2" /><path d="M4 18h13M21 18h-1" /><circle cx="19" cy="18" r="2" /></Ico>;

Object.assign(window, {
  IcBus, IcMap, IcDash, IcRoute, IcUsers, IcBell, IcSettings, IcSearch, IcMobile,
  IcUser, IcChev, IcChevDown, IcChevUp, IcClose, IcCheck, IcPlus, IcMore,
  IcClock, IcPin, IcNav, IcPhone, IcMsg, IcShield, IcLogout, IcSun, IcMoon,
  IcAttn, IcHelp, IcWalk, IcSpeed, IcWifi, IcBattery, IcStar, IcDownload,
  IcFilter, IcSort, IcLeaf, IcCamera, IcLock, IcMail, IcEye, IcTrendUp, IcTrendDown,
  IcCalendar, IcQR, IcArrowR, IcArrowL, IcWarn, IcFlag, IcSettings2,
});
