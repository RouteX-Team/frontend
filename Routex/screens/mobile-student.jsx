// Student phone sub-screens

// 01 — Live home (refined from previous version)
function StudentLive() {
  const [tab, setTab] = React.useState('home');
  return (
    <div style={{ background: 'var(--surface)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 22px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 13, color: 'var(--ink-3)' }}>Hello, Amelia</div>
          <span className="rx-avatar" style={{ width: 30, height: 30, background: 'var(--amber-soft)', color: 'var(--amber-ink)', fontSize: 11 }}>AT</span>
        </div>
        <div className="rx-display" style={{ fontSize: 28, lineHeight: 1.1 }}>Where's my bus?</div>
      </div>

      {/* Big live card */}
      <div style={{ padding: '0 22px' }}>
        <div style={{
          borderRadius: 22, padding: 20,
          background: 'linear-gradient(165deg, oklch(0.42 0.085 165), oklch(0.34 0.08 175))',
          color: 'var(--on-brand)', position: 'relative', overflow: 'hidden',
        }}>
          <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', right: -30, top: -30, opacity: 0.15 }}>
            <circle cx="90" cy="90" r="70" fill="none" stroke="white" strokeWidth="2"/>
            <circle cx="90" cy="90" r="48" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 6"/>
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '3px 8px', borderRadius: 999,
              background: 'rgba(255,255,255,0.18)', fontSize: 11, fontWeight: 500,
            }}><span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--live)' }}/>LIVE</span>
            <span style={{ fontSize: 11.5, opacity: 0.85 }}>Main Loop · B-204</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span className="rx-display" style={{ fontSize: 68, lineHeight: 1 }}>3</span>
            <span style={{ fontSize: 18, opacity: 0.85 }}>min away</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>Arriving at <b style={{ fontWeight: 600 }}>Library</b></div>

          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, opacity: 0.7, marginBottom: 6 }}>
              <span>Science Hill</span><span>Library</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.18)', borderRadius: 999, position: 'relative', overflow: 'visible' }}>
              <div style={{ width: '64%', height: '100%', background: 'var(--live)', borderRadius: 999 }}/>
              <span style={{ position: 'absolute', left: '64%', top: -4, width: 14, height: 14, borderRadius: 999, background: 'white', transform: 'translateX(-7px)', boxShadow: '0 0 0 3px rgba(255,255,255,0.3)' }}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 22px', display: 'flex', gap: 10 }}>
        <PhoneAction i={IcQR} label="Boarding QR"/>
        <PhoneAction i={IcBell} label="Notify me"/>
        <PhoneAction i={IcStar} label="Save stop"/>
      </div>

      <div style={{ padding: '0 22px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Upcoming buses</div>
          <a style={{ fontSize: 12, color: 'var(--brand-ink)' }}>See all</a>
        </div>
        <UpcomingRow num="117" route="North Express" eta="7 min" tone="brand"/>
        <UpcomingRow num="451" route="South Lakeside" eta="12 min" tone="amber"/>
        <UpcomingRow num="309" route="West Shuttle"    eta="14 min" delay="+7" tone="warning"/>
      </div>

      <div style={{ flex: 1 }}/>
      <PhoneTabBar tab={tab} setTab={setTab} tabs={[
        { id: 'home',    i: IcMap,    label: 'Live' },
        { id: 'routes',  i: IcRoute,  label: 'Routes' },
        { id: 'pass',    i: IcQR,     label: 'Pass' },
        { id: 'profile', i: IcUser,   label: 'Me' },
      ]}/>
    </div>
  );
}

function PhoneAction({ i: I, label }) {
  return (
    <button style={{
      flex: 1, padding: '12px 0', border: '1px solid var(--border)',
      borderRadius: 14, background: 'var(--surface)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      color: 'var(--ink)', cursor: 'default',
    }}>
      <I size={18} style={{ color: 'var(--brand)' }}/>
      <span style={{ fontSize: 11, color: 'var(--ink-2)', fontWeight: 500 }}>{label}</span>
    </button>
  );
}

function UpcomingRow({ num, route, eta, delay, tone }) {
  const tones = { brand: 'var(--brand-soft)', amber: 'var(--amber-soft)', warning: 'var(--warning-soft)' };
  const fgs   = { brand: 'var(--brand-ink)',  amber: 'var(--amber-ink)',  warning: 'var(--warning)' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{
        width: 36, height: 36, borderRadius: 10, background: tones[tone], color: fgs[tone],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><IcBus size={17}/></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>B-{num}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{route}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="rx-mono" style={{ fontSize: 13, fontWeight: 500 }}>{eta}</div>
        {delay && <div style={{ fontSize: 11, color: 'var(--warning)' }}>{delay} delay</div>}
      </div>
    </div>
  );
}

// 02 — Routes browser
function StudentRoutes() {
  const routes = [
    { id: 'R1', name: 'Main Loop',     stops: 'Quad → Library → Sci Hill → Stadium', eta: '3', color: 'oklch(0.42 0.085 165)', fav: true, freq: '8 min' },
    { id: 'R2', name: 'North Express', stops: 'Quad → Memorial → North Dorms',       eta: '7', color: 'oklch(0.55 0.13 50)',   fav: false, freq: '12 min' },
    { id: 'R3', name: 'West Shuttle',  stops: 'Quad → Engineering → West Village',   eta: '14', color: 'oklch(0.5 0.12 330)',   fav: false, freq: '15 min', delay: 7 },
    { id: 'R4', name: 'South Lakeside',stops: 'Quad → Business → Lake → South Lot',  eta: '12', color: 'oklch(0.65 0.13 80)',   fav: false, freq: '20 min' },
  ];
  return (
    <div style={{ background: 'var(--surface)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PhoneHeader greeting="Tuesday · 1:24 PM" title="Routes" avatar={
        <span className="rx-avatar" style={{ width: 30, height: 30, background: 'var(--amber-soft)', color: 'var(--amber-ink)', fontSize: 11 }}>AT</span>
      }/>

      {/* Search */}
      <div style={{ padding: '0 22px 12px' }}>
        <div style={{ position: 'relative' }}>
          <IcSearch size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}/>
          <input className="rx-input" placeholder="Search routes or stops…" style={{ width: '100%', paddingLeft: 34, height: 38, background: 'var(--surface-2)', border: 'none' }}/>
        </div>
      </div>

      {/* Favorite section */}
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <IcStar size={13} style={{ color: 'var(--amber)' }}/>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Favorites</span>
        </div>
        <RouteRow {...routes[0]}/>
      </div>

      <div style={{ height: 8, background: 'var(--bg-2)' }}/>

      {/* All */}
      <div style={{ padding: '14px 22px 4px', flex: 1, overflowY: 'auto' }}>
        <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>All routes</span>
        <div style={{ marginTop: 8 }}>
          {routes.slice(1).map(r => <RouteRow key={r.id} {...r}/>)}
        </div>

        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, background: 'var(--brand-soft)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--brand)' }}>
            <IcAttn size={16}/>
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--brand-ink)' }}>Service change tomorrow</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>R2 starts 30 min earlier</div>
          </div>
          <IcChev size={14} style={{ color: 'var(--brand-ink)' }}/>
        </div>
      </div>

      <PhoneTabBar tab="routes" tabs={[
        { id: 'home', i: IcMap, label: 'Live' },
        { id: 'routes', i: IcRoute, label: 'Routes' },
        { id: 'pass', i: IcQR, label: 'Pass' },
        { id: 'profile', i: IcUser, label: 'Me' },
      ]}/>
    </div>
  );
}

function RouteRow({ id, name, stops, eta, color, fav, freq, delay }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <span style={{
        width: 40, height: 40, borderRadius: 12,
        background: `color-mix(in oklch, ${color}, transparent 82%)`,
        color, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <IcRoute size={18}/>
        {fav && <span style={{ position: 'absolute', top: -3, right: -3, width: 12, height: 12, borderRadius: 999, background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)' }}/>}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13.5, fontWeight: 600 }}>{id} · {name}</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stops}</div>
        <div style={{ fontSize: 10.5, color: 'var(--ink-4)', marginTop: 2 }}>Every {freq}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="rx-mono" style={{ fontSize: 15, fontWeight: 600, color: delay ? 'var(--warning)' : 'var(--ink)' }}>{eta}<span style={{ fontSize: 11, color: 'var(--ink-3)', fontWeight: 400 }}>m</span></div>
        {delay && <div style={{ fontSize: 9.5, color: 'var(--warning)' }}>+{delay} delay</div>}
      </div>
    </div>
  );
}

// 03 — Boarding QR
function StudentQR() {
  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(180deg, oklch(0.42 0.085 165) 0%, oklch(0.32 0.07 175) 100%)',
      color: 'white', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '8px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.18)', color: 'white', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcArrowL size={16}/>
        </button>
        <span style={{ fontSize: 12, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Boarding Pass</span>
        <button style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.18)', color: 'white', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcMore size={16}/>
        </button>
      </div>

      <div style={{ padding: '8px 24px 0', textAlign: 'center' }}>
        <div className="rx-display" style={{ fontSize: 30, lineHeight: 1.1 }}>Tap to board</div>
        <div style={{ fontSize: 12.5, opacity: 0.85, marginTop: 6 }}>Show this to your driver on B-204</div>
      </div>

      {/* QR card */}
      <div style={{ padding: '22px 28px 18px' }}>
        <div style={{
          background: 'white', borderRadius: 24, padding: 20,
          boxShadow: '0 30px 60px rgba(0,0,0,0.25)',
        }}>
          {/* Stylized QR (decorative) */}
          <div style={{
            aspectRatio: '1 / 1', background: 'white', position: 'relative',
            display: 'grid', gridTemplateColumns: 'repeat(21, 1fr)', gridTemplateRows: 'repeat(21, 1fr)', gap: 2,
          }}>
            {Array.from({ length: 21 * 21 }).map((_, i) => {
              const r = Math.floor(i / 21), c = i % 21;
              // Three corner finders
              const finder = (rr, cc) => (
                ((Math.abs(r-rr) <= 3) && (Math.abs(c-cc) <= 3)) &&
                !((Math.abs(r-rr) === 2) && (Math.abs(c-cc) <= 2)) &&
                !((Math.abs(c-cc) === 2) && (Math.abs(r-rr) <= 2)) &&
                !((Math.abs(r-rr) === 2 && Math.abs(c-cc) === 2))
              );
              const isFinder = finder(3,3) || finder(3,17) || finder(17,3);
              const hash = ((r * 73 + c * 113 + r*c*7) % 100);
              const isData = !isFinder && hash > 45 && !(r > 14 && c > 14);
              return (
                <span key={i} style={{
                  background: isFinder || isData ? 'oklch(0.18 0.013 200)' : 'transparent',
                  borderRadius: 1,
                }}/>
              );
            })}
            {/* Center logo */}
            <div style={{
              position: 'absolute', inset: '40% 40% 40% 40%',
              background: 'white', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '3px solid white',
            }}>
              <div style={{
                width: '100%', height: '100%', borderRadius: 6,
                background: 'var(--brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontSize: 16, fontWeight: 400,
              }}>X</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 28px', textAlign: 'center', color: 'white' }}>
        <div style={{ fontSize: 12.5, opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Student</div>
        <div className="rx-display" style={{ fontSize: 26, marginTop: 4 }}>Amelia Tran</div>
        <div className="rx-mono" style={{ fontSize: 11.5, opacity: 0.75, marginTop: 2 }}>S001 · Class of '28</div>
      </div>

      <div style={{ flex: 1 }}/>

      <div style={{ padding: '14px 22px 28px' }}>
        <div style={{
          padding: 14, borderRadius: 16,
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(20px)',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12,
        }}>
          <PassDetail k="Route"     v="Main Loop"/>
          <PassDetail k="Stop"      v="Library"/>
          <PassDetail k="Valid"     v="Spring '26"/>
        </div>
      </div>
    </div>
  );
}

function PassDetail({ k, v }) {
  return (
    <div>
      <div style={{ fontSize: 9.5, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 3 }}>{v}</div>
    </div>
  );
}

Object.assign(window, { StudentLive, StudentRoutes, StudentQR });
