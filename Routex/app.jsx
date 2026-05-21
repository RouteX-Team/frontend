// RouteX — App shell: sidebar + topbar + screen router + tweaks panel

const { useState, useEffect, useMemo, useRef, useCallback } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "density": "comfortable"
}/*EDITMODE-END*/;

// ── Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ current, onNav, collapsed, setCollapsed }) {
  const sections = [
    { label: 'Operations', items: [
      { id: 'tracking',     name: 'Live tracking',  icon: IcMap,    badge: 'live' },
      { id: 'dashboard',    name: 'Dashboard',      icon: IcDash },
      { id: 'routes',       name: 'Routes',         icon: IcRoute },
      { id: 'fleet',        name: 'Fleet',          icon: IcBus, count: 6 },
    ]},
    { label: 'People', items: [
      { id: 'drivers',      name: 'Drivers',        icon: IcUser, count: 8 },
      { id: 'students',     name: 'Students',       icon: IcUsers, count: 4912 },
    ]},
    { label: 'Communicate', items: [
      { id: 'notifications', name: 'Notifications', icon: IcBell, count: 3 },
    ]},
    { label: 'Apps preview', items: [
      { id: 'student-app',  name: 'Student app',    icon: IcMobile },
      { id: 'parent-app',   name: 'Parent portal',  icon: IcShield },
      { id: 'driver-app',   name: 'Driver app',     icon: IcNav },
    ]},
    { label: 'Account', items: [
      { id: 'settings',     name: 'Settings',       icon: IcSettings },
      { id: 'login',        name: 'Sign-in screen', icon: IcLock },
    ]},
  ];

  return (
    <aside style={{
      width: 'var(--side-w)',
      borderRight: '1px solid var(--border)',
      background: 'var(--surface)',
      display: 'flex', flexDirection: 'column',
      height: '100vh', position: 'sticky', top: 0,
      flexShrink: 0,
    }}>
      {/* Brand */}
      <div style={{ padding: '20px 18px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <BrandMark size={28} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <span className="rx-display" style={{ fontSize: 22, color: 'var(--ink)' }}>
            Route<span className="rx-display-italic" style={{ color: 'var(--brand)' }}>X</span>
          </span>
          <span style={{ fontSize: 10.5, color: 'var(--ink-3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Aldridge University
          </span>
        </div>
      </div>

      {/* Workspace switcher */}
      <div style={{ padding: '0 12px 10px' }}>
        <button className="rx-btn ghost" style={{
          width: '100%', justifyContent: 'space-between', height: 38,
          border: '1px solid var(--border)', background: 'var(--surface-2)',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span className="rx-avatar" style={{ width: 22, height: 22, background: 'var(--brand)', color: 'var(--on-brand)', fontSize: 10 }}>TS</span>
            <span style={{ fontSize: 13 }}>Transport Services</span>
          </span>
          <IcChevDown size={14} style={{ color: 'var(--ink-3)' }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 12px' }}>
        {sections.map((s, si) => (
          <div key={s.label} style={{ marginTop: si === 0 ? 0 : 14 }}>
            <div className="rx-label" style={{ padding: '8px 12px 6px', fontSize: 10.5 }}>{s.label}</div>
            {s.items.map(item => {
              const Active = current === item.id;
              const I = item.icon;
              return (
                <button key={item.id} onClick={() => onNav(item.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 11,
                  width: '100%', padding: '0 10px',
                  height: 34,
                  border: 0, borderRadius: 'var(--r-sm)',
                  background: Active ? 'var(--brand-soft)' : 'transparent',
                  color: Active ? 'var(--brand-ink)' : 'var(--ink-2)',
                  fontWeight: Active ? 600 : 500,
                  fontSize: 13.5,
                  cursor: 'default', textAlign: 'left',
                  position: 'relative',
                  transition: 'background .12s ease',
                }} onMouseEnter={(e)=>{ if(!Active) e.currentTarget.style.background='var(--surface-2)';}} onMouseLeave={(e)=>{ if(!Active) e.currentTarget.style.background='transparent';}}>
                  {Active && <span style={{ position: 'absolute', left: -8, top: 6, bottom: 6, width: 3, borderRadius: 4, background: 'var(--brand)' }} />}
                  <I size={16} style={{ color: Active ? 'var(--brand)' : 'var(--ink-3)' }} />
                  <span style={{ flex: 1 }}>{item.name}</span>
                  {item.badge === 'live' && <span className="rx-chip live" style={{ height: 18, padding: '0 7px', fontSize: 10 }}><span className="dot" />6</span>}
                  {item.count != null && <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums' }}>{item.count.toLocaleString()}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer card */}
      <div style={{ padding: '10px 12px 14px' }}>
        <div className="rx-card" style={{
          padding: 12,
          background: 'linear-gradient(135deg, var(--brand-soft), var(--surface-2))',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <IcLeaf size={14} style={{ color: 'var(--brand)' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--brand-ink)' }}>Carbon saved · today</span>
          </div>
          <div className="rx-display" style={{ fontSize: 24, color: 'var(--ink)', lineHeight: 1 }}>
            142<span style={{ fontSize: 13, color: 'var(--ink-3)', fontFamily: 'var(--font-ui)' }}> kg CO₂e</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 6 }}>
            vs 638 individual trips
          </div>
        </div>
      </div>
    </aside>
  );
}

// Logo mark — abstract route+pin
function BrandMark({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect x="0.5" y="0.5" width="27" height="27" rx="8" fill="var(--brand)" />
      <path d="M7 19c0-5 3.5-5 7-5s7 0 7-5" stroke="var(--on-brand)" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <circle cx="7" cy="19" r="2.4" fill="var(--on-brand)" />
      <circle cx="21" cy="9" r="2.4" fill="var(--on-brand)" />
    </svg>
  );
}

// ── Top bar ────────────────────────────────────────────────────────────
function TopBar({ title, subtitle, actions }) {
  const [q, setQ] = useState('');
  return (
    <header style={{
      height: 'var(--topbar-h)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px',
      gap: 16,
      position: 'sticky', top: 0, zIndex: 10,
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="rx-display" style={{ fontSize: 24, lineHeight: 1.1, color: 'var(--ink)', letterSpacing: '-0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 }}>{subtitle}</div>}
      </div>
      <div style={{ flex: 1 }} />

      <div style={{ position: 'relative', width: 280 }}>
        <IcSearch size={15} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }} />
        <input className="rx-input" placeholder="Search buses, routes, students…"
          value={q} onChange={e => setQ(e.target.value)}
          style={{ width: '100%', paddingLeft: 32, background: 'var(--surface)' }} />
        <span style={{
          position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
          fontSize: 10.5, color: 'var(--ink-3)', border: '1px solid var(--border)',
          padding: '2px 6px', borderRadius: 5, background: 'var(--surface-2)',
        }}>⌘K</span>
      </div>

      {actions}

      <button className="rx-btn ghost icon" title="Notifications" style={{ position: 'relative' }}>
        <IcBell size={17} />
        <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: 999, background: 'var(--live)', border: '2px solid var(--bg)' }} />
      </button>
      <button className="rx-btn ghost icon" title="Help"><IcHelp size={17} /></button>

      <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

      <button className="rx-btn ghost" style={{ paddingLeft: 6, paddingRight: 10 }}>
        <span className="rx-avatar" style={{ background: 'var(--plum-soft)', color: 'var(--plum-ink)' }}>EM</span>
        <span style={{ fontSize: 13 }}>Elena Marquez</span>
        <IcChevDown size={13} style={{ color: 'var(--ink-3)' }} />
      </button>
    </header>
  );
}

// ── App ────────────────────────────────────────────────────────────────
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [screen, setScreen] = useState('tracking');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
    document.documentElement.setAttribute('data-density', t.density);
  }, [t.theme, t.density]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  // Render fullscreen for login; sidebar layout otherwise
  if (screen === 'login') {
    return (
      <>
        <LoginScreen onSignIn={() => { setScreen('tracking'); showToast('Welcome back, Elena'); }} />
        <RxTweaksPanel t={t} setTweak={setTweak} screen={screen} setScreen={setScreen} />
        {toast && <div className="rx-toast"><IcCheck size={14} style={{ color: 'var(--brand)' }}/> {toast}</div>}
      </>
    );
  }

  const titles = {
    tracking:       ['Live tracking',   'Real-time positions of all active buses · updates every 3s'],
    dashboard:      ['Operations',      'Today · ' + new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })],
    routes:         ['Routes',          '4 active routes · 87 stops · 23 trips today'],
    fleet:          ['Fleet',           '6 buses · 5 in service · 1 idle'],
    drivers:        ['Drivers',         '8 drivers · 6 on shift'],
    students:       ['Students',        '4,912 enrolled · 198 onboard now'],
    notifications:  ['Notifications',   '3 unread · 7 today'],
    'student-app':  ['Student mobile',  'Preview · iOS'],
    'parent-app':   ['Parent portal',   'Preview · iOS'],
    'driver-app':   ['Driver mobile',   'Preview · iOS'],
    settings:       ['Settings',        'Profile · workspace · integrations'],
  };
  const [title, subtitle] = titles[screen] || ['—', ''];

  let actions = null;
  if (screen === 'tracking') actions = (
    <>
      <button className="rx-btn sm"><IcDownload size={14} />Export</button>
      <button className="rx-btn sm primary"><IcPlus size={14} />Dispatch</button>
    </>
  );
  if (screen === 'dashboard') actions = (
    <>
      <button className="rx-btn sm"><IcCalendar size={14} />Today</button>
      <button className="rx-btn sm"><IcDownload size={14} />Export</button>
    </>
  );
  if (['routes','fleet','drivers','students'].includes(screen)) actions = (
    <>
      <button className="rx-btn sm"><IcFilter size={14} />Filter</button>
      <button className="rx-btn sm primary"><IcPlus size={14} />New</button>
    </>
  );

  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
        <Sidebar current={screen} onNav={setScreen} />
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <TopBar title={title} subtitle={subtitle} actions={actions} />
          <div key={screen} style={{ flex: 1, overflow: 'auto' }} className="rx-fade-up">
            {screen === 'tracking'       && <TrackingScreen onToast={showToast} />}
            {screen === 'dashboard'      && <DashboardScreen />}
            {screen === 'routes'         && <RoutesScreen />}
            {screen === 'fleet'          && <FleetScreen />}
            {screen === 'drivers'        && <DriversScreen />}
            {screen === 'students'       && <StudentsScreen />}
            {screen === 'notifications'  && <NotificationsScreen />}
            {screen === 'student-app'    && <StudentAppScreen />}
            {screen === 'parent-app'     && <ParentAppScreen />}
            {screen === 'driver-app'     && <DriverAppScreen />}
            {screen === 'settings'       && <SettingsScreen />}
          </div>
        </main>
      </div>
      <RxTweaksPanel t={t} setTweak={setTweak} screen={screen} setScreen={setScreen} />
      {toast && <div className="rx-toast"><IcCheck size={14} style={{ color: 'var(--brand)' }}/> {toast}</div>}
    </>
  );
}

function RxTweaksPanel({ t, setTweak, screen, setScreen }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Appearance" />
      <TweakRadio
        label="Theme"
        value={t.theme}
        options={['light', 'dark']}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakRadio
        label="Density"
        value={t.density}
        options={['comfortable', 'compact']}
        onChange={(v) => setTweak('density', v)}
      />
      <TweakSection label="Jump to screen" />
      <TweakSelect
        label="Screen"
        value={screen}
        options={[
          'tracking','dashboard','routes','fleet','drivers','students',
          'notifications','student-app','parent-app','driver-app','settings','login',
        ]}
        onChange={(v) => setScreen(v)}
      />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
