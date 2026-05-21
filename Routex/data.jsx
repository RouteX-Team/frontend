// RouteX — shared mock data + utilities

// Campus center (Stanford-ish, for realistic Leaflet tiles)
const CAMPUS = { lat: 37.4275, lng: -122.1697, name: 'Aldridge University' };

// Route polylines (rough loops around the campus area)
const ROUTES = [
  {
    id: 'R1', name: 'Main Loop',     color: '#1f7a5b', tone: 'brand',
    stops: ['Quad', 'Library', 'Science Hill', 'Stadium', 'East Gate'],
    points: [
      [37.4275, -122.1697], [37.4250, -122.1665], [37.4220, -122.1640],
      [37.4198, -122.1670], [37.4205, -122.1715], [37.4235, -122.1735],
      [37.4275, -122.1697],
    ],
  },
  {
    id: 'R2', name: 'North Express', color: '#b8612d', tone: 'live',
    stops: ['Quad', 'Memorial Auditorium', 'North Dorms', 'Athletic Center'],
    points: [
      [37.4275, -122.1697], [37.4305, -122.1685], [37.4330, -122.1660],
      [37.4348, -122.1625], [37.4330, -122.1595], [37.4300, -122.1610],
      [37.4280, -122.1650], [37.4275, -122.1697],
    ],
  },
  {
    id: 'R3', name: 'West Shuttle',  color: '#7a4f8e', tone: 'plum',
    stops: ['Quad', 'Engineering', 'West Village', 'Medical Center'],
    points: [
      [37.4275, -122.1697], [37.4268, -122.1740], [37.4256, -122.1780],
      [37.4232, -122.1810], [37.4210, -122.1785], [37.4225, -122.1745],
      [37.4258, -122.1715], [37.4275, -122.1697],
    ],
  },
  {
    id: 'R4', name: 'South Lakeside', color: '#a17712', tone: 'amber',
    stops: ['Quad', 'Business School', 'Lake Path', 'South Lot'],
    points: [
      [37.4275, -122.1697], [37.4243, -122.1700], [37.4215, -122.1690],
      [37.4188, -122.1700], [37.4178, -122.1730], [37.4200, -122.1745],
      [37.4240, -122.1720], [37.4275, -122.1697],
    ],
  },
];

const BUSES = [
  { id: 'B-204', label: '204', plate: 'RTX-204', route: 'R1', driver: 'Maya Okafor',  status: 'live',    students: 28, capacity: 42, speed: 24, t: 0.18, nextStop: 'Library',           eta: 3,  battery: 86, lateMin: 0 },
  { id: 'B-117', label: '117', plate: 'RTX-117', route: 'R2', driver: 'Theo Ramirez',  status: 'live',    students: 19, capacity: 36, speed: 18, t: 0.62, nextStop: 'North Dorms',        eta: 6,  battery: 71, lateMin: 0 },
  { id: 'B-309', label: '309', plate: 'RTX-309', route: 'R3', driver: 'Priya Shah',    status: 'delayed', students: 33, capacity: 42, speed: 12, t: 0.41, nextStop: 'West Village',       eta: 11, battery: 58, lateMin: 7 },
  { id: 'B-451', label: '451', plate: 'RTX-451', route: 'R4', driver: 'Adaora Nwosu',  status: 'live',    students: 14, capacity: 36, speed: 22, t: 0.05, nextStop: 'Business School',    eta: 2,  battery: 93, lateMin: 0 },
  { id: 'B-128', label: '128', plate: 'RTX-128', route: 'R1', driver: 'Lucas Pereira', status: 'idle',    students: 0,  capacity: 42, speed: 0,  t: 0,    nextStop: 'Depot',              eta: 0,  battery: 100, lateMin: 0 },
  { id: 'B-377', label: '377', plate: 'RTX-377', route: 'R2', driver: 'Jin Park',      status: 'live',    students: 22, capacity: 36, speed: 27, t: 0.85, nextStop: 'Athletic Center',    eta: 4,  battery: 64, lateMin: 0 },
];

const DRIVERS = [
  { id: 'D01', name: 'Maya Okafor',   route: 'R1', trips: 412, rating: 4.9, status: 'active',  shift: 'AM' },
  { id: 'D02', name: 'Theo Ramirez',  route: 'R2', trips: 289, rating: 4.8, status: 'active',  shift: 'AM' },
  { id: 'D03', name: 'Priya Shah',    route: 'R3', trips: 631, rating: 4.7, status: 'active',  shift: 'PM' },
  { id: 'D04', name: 'Adaora Nwosu',  route: 'R4', trips: 178, rating: 5.0, status: 'active',  shift: 'AM' },
  { id: 'D05', name: 'Lucas Pereira', route: 'R1', trips: 502, rating: 4.6, status: 'standby', shift: 'PM' },
  { id: 'D06', name: 'Jin Park',      route: 'R2', trips: 367, rating: 4.9, status: 'active',  shift: 'PM' },
  { id: 'D07', name: 'Noor Haddad',   route: '—',  trips: 245, rating: 4.8, status: 'off',     shift: '—'  },
  { id: 'D08', name: 'Ines Carvalho', route: '—',  trips: 198, rating: 4.7, status: 'off',     shift: '—'  },
];

const NOTIFS = [
  { id: 'n1', kind: 'delay',   title: 'B-309 delayed 7 min',                meta: 'West Shuttle · West Village',     time: '2 min ago', unread: true,  tone: 'warning' },
  { id: 'n2', kind: 'arrival', title: 'B-204 arriving at Library',           meta: 'Main Loop · 3 min ETA',           time: '4 min ago', unread: true,  tone: 'info' },
  { id: 'n3', kind: 'attend',  title: '198 students checked in today',       meta: 'Attendance · 87% on time',         time: '12 min ago', unread: true,  tone: 'success' },
  { id: 'n4', kind: 'alert',   title: 'Driver pressed SOS on B-309',         meta: 'Cleared by dispatch · Priya Shah', time: '38 min ago', unread: false, tone: 'danger' },
  { id: 'n5', kind: 'system',  title: 'Route R2 schedule updated',           meta: 'Effective tomorrow 7:00 AM',       time: '1 h ago',    unread: false, tone: 'brand' },
  { id: 'n6', kind: 'maint',   title: 'B-128 due for inspection',            meta: 'Maintenance · 800 mi remaining',   time: '3 h ago',    unread: false, tone: 'amber' },
  { id: 'n7', kind: 'arrival', title: 'B-451 reached South Lot',             meta: 'South Lakeside · on time',         time: '4 h ago',    unread: false, tone: 'success' },
];

const STUDENTS = [
  { id: 'S001', name: 'Amelia Tran',     grade: 'Sophomore', route: 'R1', stop: 'Library',       guardian: 'Hung Tran',      status: 'onboard' },
  { id: 'S002', name: 'Carlos Mendes',   grade: 'Freshman',  route: 'R2', stop: 'North Dorms',    guardian: 'Rita Mendes',    status: 'waiting' },
  { id: 'S003', name: 'Sienna Bell',     grade: 'Junior',    route: 'R3', stop: 'West Village',   guardian: 'Joel Bell',      status: 'onboard' },
  { id: 'S004', name: 'Dmitri Volkov',   grade: 'Senior',    route: 'R1', stop: 'Stadium',        guardian: 'Anya Volkov',    status: 'dropped' },
  { id: 'S005', name: 'Priya Ananth',    grade: 'Freshman',  route: 'R4', stop: 'Business School',guardian: 'Sundar Ananth',  status: 'onboard' },
  { id: 'S006', name: 'Eli Brennan',     grade: 'Sophomore', route: 'R2', stop: 'Athletic Center',guardian: 'Mara Brennan',   status: 'absent'  },
  { id: 'S007', name: 'Yuki Tanaka',     grade: 'Junior',    route: 'R3', stop: 'Medical Center', guardian: 'Hiro Tanaka',    status: 'onboard' },
  { id: 'S008', name: 'Olufemi Adeyemi', grade: 'Senior',    route: 'R1', stop: 'East Gate',      guardian: 'Funmi Adeyemi',  status: 'waiting' },
];

// Avatar palette — soft, harmonized
const AVATAR_TONES = [
  { bg: 'oklch(0.92 0.04 165)', fg: 'oklch(0.32 0.08 165)' },
  { bg: 'oklch(0.93 0.04 50)',  fg: 'oklch(0.45 0.13 45)'  },
  { bg: 'oklch(0.92 0.04 330)', fg: 'oklch(0.4  0.12 330)' },
  { bg: 'oklch(0.93 0.04 85)',  fg: 'oklch(0.5  0.13 80)'  },
  { bg: 'oklch(0.92 0.04 220)', fg: 'oklch(0.4  0.1  240)' },
];
function avatarFor(name) {
  let h = 0; for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TONES[h % AVATAR_TONES.length];
}
function initialsOf(name) {
  return (name || '').split(/\s+/).map(p => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

// Walk forward along route waypoints; returns lat,lng + heading (deg).
function pointAlong(route, t) {
  const pts = route.points;
  const seg = pts.length - 1;
  const x = (t % 1) * seg;
  const i = Math.floor(x);
  const f = x - i;
  const a = pts[i], b = pts[(i + 1) % pts.length];
  const lat = a[0] + (b[0] - a[0]) * f;
  const lng = a[1] + (b[1] - a[1]) * f;
  const heading = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
  return { lat, lng, heading };
}

Object.assign(window, {
  CAMPUS, ROUTES, BUSES, DRIVERS, NOTIFS, STUDENTS,
  avatarFor, initialsOf, pointAlong,
});
