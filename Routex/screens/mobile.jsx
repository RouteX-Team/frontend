// Mobile screens shell — shared PhoneRail used by the three app preview pages.

const PHONE_SCALE = 0.74;
const PHONE_W = 402, PHONE_H = 874;

function ScaledPhone({ dark, title, children }) {
  return (
    <div style={{
      position: 'relative',
      width: PHONE_W * PHONE_SCALE,
      height: PHONE_H * PHONE_SCALE,
      flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: PHONE_W, height: PHONE_H,
        transform: `scale(${PHONE_SCALE})`, transformOrigin: 'top left',
      }}>
        <IOSDevice dark={dark} title={title}>{children}</IOSDevice>
      </div>
    </div>
  );
}

function PhoneRail({ eyebrow, eyebrowTone, title, desc, features, phones }) {
  const eyebrowColor = {
    brand: 'var(--brand-ink)', plum: 'var(--plum-ink)', live: 'var(--live-ink)',
  }[eyebrowTone] || 'var(--brand-ink)';
  return (
    <div style={{
      padding: '32px 32px 48px',
      minHeight: 'calc(100vh - var(--topbar-h))',
      background: `
        radial-gradient(circle at 12% 20%, var(--brand-soft) 0%, transparent 38%),
        radial-gradient(circle at 88% 80%, var(--plum-soft) 0%, transparent 36%),
        var(--bg)
      `,
    }}>
      {/* Header */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'end', marginBottom: 28 }}>
        <div>
          <span className="rx-eyebrow" style={{ color: eyebrowColor }}>{eyebrow}</span>
          <h2 className="rx-display" style={{ fontSize: 46, margin: '10px 0 10px', lineHeight: 1.04, letterSpacing: '-0.015em' }}>{title}</h2>
          <p style={{ fontSize: 14.5, color: 'var(--ink-3)', margin: 0, maxWidth: 580, lineHeight: 1.55 }}>{desc}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {features.map((f, i) => <Feature key={i} {...f}/>)}
        </div>
      </div>

      {/* Phones */}
      <div style={{
        display: 'flex', gap: 32, alignItems: 'flex-start',
        overflowX: 'auto', paddingBottom: 18, paddingRight: 8,
      }}>
        {phones.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <ScaledPhone dark={p.dark} title={p.title}>{p.render()}</ScaledPhone>
            <div style={{ marginTop: 16, maxWidth: PHONE_W * PHONE_SCALE, paddingLeft: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10.5, fontWeight: 600, color: 'var(--ink-3)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{String(i+1).padStart(2,'0')}</span>
                <span style={{ width: 14, height: 1, background: 'var(--border-strong)' }}/>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink)' }}>{p.label}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4, lineHeight: 1.45 }}>{p.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Feature({ i: I, t, s }) {
  return (
    <div className="rx-card" style={{
      padding: 14, display: 'flex', flexDirection: 'column', gap: 10,
      background: 'rgba(255,255,255,0.6)',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{
        width: 30, height: 30, borderRadius: 8,
        background: 'var(--brand-soft)', color: 'var(--brand-ink)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><I size={15}/></span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{t}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 }}>{s}</div>
      </div>
    </div>
  );
}

// ── Tiny shared phone primitives ───────────────────────────────────
function PhoneHeader({ greeting, title, avatar, light = true }) {
  const muted = light ? 'var(--ink-3)' : 'rgba(255,255,255,0.65)';
  const ink   = light ? 'var(--ink)'   : '#fff';
  return (
    <div style={{ padding: '8px 22px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          {greeting && <div style={{ fontSize: 12.5, color: muted }}>{greeting}</div>}
          <div className="rx-display" style={{ fontSize: 28, lineHeight: 1.1, color: ink, marginTop: 2 }}>{title}</div>
        </div>
        {avatar}
      </div>
    </div>
  );
}

function PhoneTabBar({ tab, setTab, tabs, dark = false }) {
  return (
    <div style={{
      padding: '10px 18px 20px',
      borderTop: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid var(--border)',
      display: 'flex', gap: 6,
      background: dark ? '#0F1413' : 'var(--surface)',
    }}>
      {tabs.map(t => {
        const I = t.i;
        const A = tab === t.id;
        const activeBg = dark ? 'rgba(255,107,53,0.15)' : 'var(--brand-soft)';
        const activeFg = dark ? 'var(--live)' : 'var(--brand-ink)';
        const inactiveFg = dark ? 'rgba(255,255,255,0.5)' : 'var(--ink-3)';
        return (
          <button key={t.id} onClick={() => setTab && setTab(t.id)} style={{
            flex: 1, padding: '8px 0', border: 0, borderRadius: 12,
            background: A ? activeBg : 'transparent',
            color: A ? activeFg : inactiveFg,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            cursor: 'default',
          }}>
            <I size={18}/>
            <span style={{ fontSize: 10.5, fontWeight: A ? 600 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Top-level screens (exported) ───────────────────────────────────
function StudentAppScreen() {
  return (
    <PhoneRail
      eyebrow="Student app · iOS"
      eyebrowTone="brand"
      title={<>Catch your bus, <span className="rx-display-italic" style={{ color: 'var(--brand)' }}>without the wait.</span></>}
      desc="Built for students who want one number on the home screen: how many minutes until my bus. Live countdown, a boarding QR for attendance, and gentle notifications when the bus is five minutes out."
      features={[
        { i: IcPin,  t: 'Saved stops',    s: 'One-tap pin for daily stops' },
        { i: IcQR,   t: 'Boarding QR',    s: 'Scanned at door for roll' },
        { i: IcBell, t: 'ETA pushes',     s: '5-min and arrival alerts' },
      ]}
      phones={[
        { label: 'Live · home',       sub: 'Next bus countdown with a progress track between your last stop and your destination.',  title: "Where's my bus", render: () => <StudentLive/> },
        { label: 'Routes browser',    sub: "All four campus routes, next-bus times, and your favorited line surfaced at the top.", title: 'Routes',         render: () => <StudentRoutes/> },
        { label: 'Boarding QR',       sub: 'Full-bleed scannable pass with your ID, route and stop — works offline.',                 title: 'Board',          render: () => <StudentQR/> },
      ]}/>
  );
}

function ParentAppScreen() {
  return (
    <PhoneRail
      eyebrow="Parent portal · iOS"
      eyebrowTone="plum"
      title={<>Peace of mind, <span className="rx-display-italic" style={{ color: 'var(--plum)' }}>delivered.</span></>}
      desc="Every leg of your child's commute, in real time. Boarding, en-route and drop-off confirmations land as pushes — and you can message the driver directly when something matters."
      features={[
        { i: IcShield, t: 'Verified guardians', s: 'Linked to school records' },
        { i: IcBell,   t: 'Trip events',        s: 'Onboard · arriving · safe' },
        { i: IcPhone,  t: 'Driver messaging',   s: 'Logged, dispatch-monitored' },
      ]}
      phones={[
        { label: 'Family today',     sub: 'A single card per child — onboard, en-route or dropped off — with a live timeline.',          title: 'My family',  render: () => <ParentFamily/> },
        { label: 'Trip detail',      sub: "Open a child's commute to see the route on a map, ETA to school and recent driver notes.",   title: 'Amelia',     render: () => <ParentTrip/> },
        { label: 'Inbox',            sub: 'Pinned drivers, today\'s pushes and a thread for each guardian↔driver conversation.',         title: 'Inbox',      render: () => <ParentInbox/> },
      ]}/>
  );
}

function DriverAppScreen() {
  return (
    <PhoneRail
      eyebrow="Driver app · iOS"
      eyebrowTone="live"
      title={<>Eyes up, <span className="rx-display-italic" style={{ color: 'var(--live)' }}>route ready.</span></>}
      desc="A driver-first dark interface that glances like a transit display: one instruction at a time, a tappable manifest, and an always-visible SOS that requires a three-second hold to trigger."
      features={[
        { i: IcCheck, t: 'Pre-trip checks',  s: '12-point vehicle inspection' },
        { i: IcNav,   t: 'Voice prompts',    s: 'Hands-free turn-by-turn' },
        { i: IcAttn,  t: 'SOS to dispatch',  s: 'Three-second hold confirms' },
      ]}
      phones={[
        { label: 'Pre-trip',     sub: 'Walk-around checklist a driver clears before service. Auto-fills the day\'s manifest on completion.', title: 'Start of day', dark: true, render: () => <DriverPretrip/> },
        { label: 'On route',     sub: 'Single next-instruction card, live trip metrics and one-tap dispatch escalation.',                       title: 'On route',     dark: true, render: () => <DriverOnRoute/> },
        { label: 'Manifest',     sub: 'Live boarding state per student, grouped by stop. Tap a row to confirm or flag.',                        title: 'Manifest',     dark: true, render: () => <DriverManifest/> },
      ]}/>
  );
}

Object.assign(window, {
  StudentAppScreen, ParentAppScreen, DriverAppScreen,
  ScaledPhone, PhoneRail, PhoneHeader, PhoneTabBar, Feature,
});
