// Notifications center + Settings + Login

function NotificationsScreen() {
  const [tab, setTab] = React.useState('all');
  const [items, setItems] = React.useState(NOTIFS);
  const filters = ['all', 'alerts', 'arrivals', 'system'];
  const filter = (n) => {
    if (tab === 'all') return true;
    if (tab === 'alerts')   return ['delay','alert','maint'].includes(n.kind);
    if (tab === 'arrivals') return ['arrival','attend'].includes(n.kind);
    if (tab === 'system')   return ['system'].includes(n.kind);
    return true;
  };
  const visible = items.filter(filter);

  return (
    <div style={{ padding: 24, display: 'flex', gap: 'var(--gap)', minHeight: 'calc(100vh - var(--topbar-h))' }}>
      {/* Left list */}
      <div className="rx-card" style={{ flex: '0 0 420px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Inbox</div>
            <button className="rx-btn ghost sm" onClick={() => setItems(items.map(i => ({ ...i, unread: false })))}>
              <IcCheck size={13}/>Mark all read
            </button>
          </div>
          <div style={{ display: 'flex', gap: 3, padding: 3, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' }}>
            {filters.map(f => (
              <button key={f} onClick={() => setTab(f)} style={{
                flex: 1, height: 28, padding: '0 8px', border: 0, borderRadius: 6,
                background: tab === f ? 'var(--surface)' : 'transparent',
                boxShadow: tab === f ? 'var(--shadow-sm)' : 'none',
                fontSize: 12, fontWeight: 500, textTransform: 'capitalize',
                color: tab === f ? 'var(--ink)' : 'var(--ink-3)',
                cursor: 'default',
              }}>{f}</button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {visible.map(n => <NotifRow key={n.id} n={n}/>)}
          {visible.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 13 }}>
              <div style={{
                width: 44, height: 44, margin: '0 auto 10px', borderRadius: 999,
                background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><IcCheck size={20} style={{ color: 'var(--ink-3)' }}/></div>
              All clear — no alerts in this view.
            </div>
          )}
        </div>
      </div>

      {/* Right detail */}
      <div className="rx-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <NotifDetail n={items[0]}/>
      </div>
    </div>
  );
}

function NotifRow({ n }) {
  const toneFor = {
    success: ['var(--success-soft)','var(--success)'],
    info:    ['var(--info-soft)','var(--info)'],
    warning: ['var(--warning-soft)','var(--warning)'],
    danger:  ['var(--danger-soft)','var(--danger)'],
    brand:   ['var(--brand-soft)','var(--brand-ink)'],
    amber:   ['var(--amber-soft)','var(--amber-ink)'],
    plum:    ['var(--plum-soft)','var(--plum-ink)'],
  };
  const [bg, fg] = toneFor[n.tone] || toneFor.brand;
  const iconFor = {
    delay: IcClock, arrival: IcPin, attend: IcUsers, alert: IcAttn,
    system: IcSettings, maint: IcSettings2,
  };
  const I = iconFor[n.kind] || IcBell;
  return (
    <div style={{
      padding: '14px 16px', borderBottom: '1px solid var(--border)',
      display: 'flex', gap: 12, alignItems: 'flex-start',
      background: n.unread ? 'var(--surface)' : 'transparent',
      cursor: 'default',
    }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
       onMouseLeave={e => e.currentTarget.style.background = n.unread ? 'var(--surface)' : 'transparent'}>
      <span style={{
        width: 34, height: 34, borderRadius: 10, background: bg, color: fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <I size={16}/>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: n.unread ? 600 : 500, color: 'var(--ink)' }}>{n.title}</div>
          {n.unread && <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--brand)', flexShrink: 0 }}/>}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{n.meta}</div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>{n.time}</div>
    </div>
  );
}

function NotifDetail({ n }) {
  if (!n) return null;
  return (
    <>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
        <span style={{
          width: 44, height: 44, borderRadius: 12,
          background: 'var(--warning-soft)', color: 'var(--warning)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <IcClock size={22}/>
        </span>
        <div style={{ flex: 1 }}>
          <div className="rx-display" style={{ fontSize: 22 }}>{n.title}</div>
          <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3 }}>{n.meta} · {n.time}</div>
        </div>
        <span className="rx-chip warning">+7 min delay</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <div className="rx-label" style={{ marginBottom: 8 }}>What happened</div>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.55 }}>
            Bus 309 on the West Shuttle route is delayed approximately 7 minutes due to construction
            activity on Campus Drive between Engineering and West Village. Driver Priya Shah confirmed
            traffic at 14:35.
          </p>
        </div>

        <div>
          <div className="rx-label" style={{ marginBottom: 10 }}>Impact</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <DetailKV2 k="Students affected" v="33" tone="brand"/>
            <DetailKV2 k="Stops impacted" v="3" tone="warning"/>
            <DetailKV2 k="Auto-notified" v="33 parents" tone="plum"/>
          </div>
        </div>

        <div>
          <div className="rx-label" style={{ marginBottom: 10 }}>Suggested actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <ActionRow icon={IcRoute} title="Reroute via 2nd Avenue" sub="Saves ~5 min · 0 stop changes" primary/>
            <ActionRow icon={IcBell}  title="Push update to affected parents" sub="33 recipients · ETA refresh"/>
            <ActionRow icon={IcPhone} title="Call driver Priya Shah" sub="Confirm route + ETA"/>
          </div>
        </div>
      </div>
    </>
  );
}

function DetailKV2({ k, v, tone }) {
  const tones = {
    brand:'var(--brand-ink)', warning:'var(--warning)',
    plum:'var(--plum-ink)', success:'var(--success)',
  };
  return (
    <div className="rx-card rx-card-pad" style={{ padding: 14 }}>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{k}</div>
      <div className="rx-display" style={{ fontSize: 22, color: tones[tone] || 'var(--ink)', marginTop: 4, lineHeight: 1 }}>{v}</div>
    </div>
  );
}

function ActionRow({ icon: I, title, sub, primary }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 14, borderRadius: 'var(--r-sm)',
      border: `1px solid ${primary ? 'var(--brand)' : 'var(--border)'}`,
      background: primary ? 'var(--brand-soft)' : 'var(--surface)',
    }}>
      <span style={{
        width: 36, height: 36, borderRadius: 9,
        background: primary ? 'var(--surface)' : 'var(--surface-2)',
        color: primary ? 'var(--brand)' : 'var(--ink-2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><I size={17}/></span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: primary ? 'var(--brand-ink)' : 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>
      </div>
      <button className={`rx-btn sm ${primary ? 'primary' : ''}`}>{primary ? 'Apply' : 'Action'}</button>
    </div>
  );
}

// ── Settings ────────────────────────────────────────────────────────
function SettingsScreen() {
  return (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
      <aside>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[
            { label: 'Profile', active: true },
            { label: 'Workspace' },
            { label: 'Notifications' },
            { label: 'Integrations' },
            { label: 'Billing' },
            { label: 'Members' },
            { label: 'Security' },
          ].map(i => (
            <button key={i.label} style={{
              textAlign: 'left', padding: '8px 12px', border: 0, borderRadius: 'var(--r-sm)',
              background: i.active ? 'var(--brand-soft)' : 'transparent',
              color: i.active ? 'var(--brand-ink)' : 'var(--ink-2)',
              fontWeight: i.active ? 600 : 500, fontSize: 13.5,
              cursor: 'default',
            }}>{i.label}</button>
          ))}
        </div>
      </aside>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="rx-card rx-card-pad">
          <div className="rx-label" style={{ marginBottom: 18 }}>Profile</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
            <span className="rx-avatar" style={{ width: 64, height: 64, fontSize: 22, background: 'var(--plum-soft)', color: 'var(--plum-ink)' }}>EM</span>
            <div>
              <div className="rx-display" style={{ fontSize: 22 }}>Elena Marquez</div>
              <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Transport Operations · admin</div>
            </div>
            <div style={{ flex: 1 }}/>
            <button className="rx-btn"><IcCamera size={14}/>Change</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Full name" value="Elena Marquez"/>
            <Field label="Email"     value="elena.marquez@aldridge.edu"/>
            <Field label="Phone"     value="+1 (415) 555-0182"/>
            <Field label="Role"      value="Operations Admin"/>
          </div>
        </div>
        <div className="rx-card rx-card-pad">
          <div className="rx-label" style={{ marginBottom: 14 }}>Preferences</div>
          <PrefRow title="Email digests"     sub="Daily summary at 6:00 PM" on/>
          <PrefRow title="SMS alerts"         sub="For critical disruptions only" on/>
          <PrefRow title="Driver SOS push"    sub="Wake device on incident"/>
          <PrefRow title="Live audio dispatch" sub="Beta · TalkBack channel"/>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 500 }}>{label}</span>
      <input className="rx-input" defaultValue={value}/>
    </label>
  );
}

function PrefRow({ title, sub, on }) {
  const [v, setV] = React.useState(!!on);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>{sub}</div>
      </div>
      <button onClick={() => setV(!v)} style={{
        width: 38, height: 22, borderRadius: 999, border: 0,
        background: v ? 'var(--brand)' : 'var(--border-strong)',
        position: 'relative', cursor: 'default', transition: 'background .15s ease',
      }}>
        <span style={{
          position: 'absolute', top: 2, left: v ? 18 : 2,
          width: 18, height: 18, borderRadius: 999, background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,.18)', transition: 'left .15s ease',
        }}/>
      </button>
    </div>
  );
}

// ── Login ────────────────────────────────────────────────────────────
function LoginScreen({ onSignIn }) {
  const [email, setEmail] = React.useState('elena.marquez@aldridge.edu');
  const [password, setPassword] = React.useState('••••••••');
  const [show, setShow] = React.useState(false);
  return (
    <div style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1.05fr',
      background: 'var(--bg)',
    }}>
      {/* Left — form */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        padding: '40px 56px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={32}/>
          <span className="rx-display" style={{ fontSize: 26 }}>
            Route<span className="rx-display-italic" style={{ color: 'var(--brand)' }}>X</span>
          </span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 380, width: '100%', margin: '0 auto' }}>
          <span className="rx-eyebrow" style={{ color: 'var(--brand-ink)' }}>Sign in</span>
          <h1 className="rx-display" style={{ fontSize: 44, margin: '12px 0 6px', lineHeight: 1.05 }}>
            Welcome back to <span className="rx-display-italic" style={{ color: 'var(--brand)' }}>campus.</span>
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-3)', margin: '0 0 28px' }}>
            Aldridge University · Transport Services
          </p>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>University email</span>
            <div style={{ position: 'relative' }}>
              <IcMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}/>
              <input className="rx-input" value={email} onChange={e=>setEmail(e.target.value)} style={{ width: '100%', paddingLeft: 36, height: 42 }}/>
            </div>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 18 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</span>
              <a style={{ fontSize: 12, color: 'var(--brand-ink)', textDecoration: 'none', cursor: 'default' }}>Forgot?</a>
            </span>
            <div style={{ position: 'relative' }}>
              <IcLock size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}/>
              <input className="rx-input" type={show?'text':'password'} value={password} onChange={e=>setPassword(e.target.value)} style={{ width: '100%', paddingLeft: 36, paddingRight: 36, height: 42 }}/>
              <button onClick={()=>setShow(!show)} className="rx-btn ghost sm icon" style={{ position: 'absolute', right: 4, top: 4, height: 34, width: 34 }}>
                <IcEye size={14}/>
              </button>
            </div>
          </label>

          <button className="rx-btn primary" style={{ width: '100%', height: 44, fontSize: 14, fontWeight: 600 }} onClick={onSignIn}>
            Sign in
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
            <span style={{ fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button className="rx-btn" style={{ height: 42, justifyContent: 'center' }}>SSO · Okta</button>
            <button className="rx-btn" style={{ height: 42, justifyContent: 'center' }}>Microsoft 365</button>
          </div>

          <p style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 28, textAlign: 'center' }}>
            New to RouteX? <a style={{ color: 'var(--brand-ink)' }}>Request access</a>
          </p>
        </div>

        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>© 2026 Aldridge University · Transport Services</div>
      </div>

      {/* Right — illustrated panel */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, oklch(0.42 0.085 165), oklch(0.32 0.07 175))',
        color: 'var(--on-brand)',
        display: 'flex', flexDirection: 'column', padding: '40px 48px',
      }}>
        {/* Decorative route lines */}
        <svg width="100%" height="100%" viewBox="0 0 600 800" style={{ position: 'absolute', inset: 0, opacity: 0.16 }}>
          <path d="M50 100 Q200 200 150 350 T300 600 Q400 700 550 650" stroke="white" strokeWidth="2" fill="none" strokeDasharray="6 8"/>
          <path d="M100 50 Q250 150 350 100 T550 250 Q500 400 400 450" stroke="white" strokeWidth="2" fill="none" strokeDasharray="6 8"/>
          <circle cx="150" cy="350" r="6" fill="white"/>
          <circle cx="300" cy="600" r="6" fill="white"/>
          <circle cx="350" cy="100" r="6" fill="white"/>
          <circle cx="400" cy="450" r="6" fill="white"/>
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span className="rx-chip" style={{
            background: 'rgba(255,255,255,0.16)', color: 'white', borderColor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(8px)',
          }}><span className="dot" style={{ background: 'var(--live)' }}/>Live across 4 campuses</span>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <h2 className="rx-display" style={{ fontSize: 52, lineHeight: 1.05, margin: '0 0 16px' }}>
            Every bus,<br/>
            <span className="rx-display-italic">every student,</span><br/>
            on time.
          </h2>
          <p style={{ fontSize: 16, opacity: 0.85, maxWidth: 360, lineHeight: 1.5, margin: 0 }}>
            Real-time tracking, automatic notifications, and operational insight —
            built for the people who make a campus move.
          </p>
        </div>

        {/* Mini ETA card */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 12 }}>
          <div style={{
            flex: 1, padding: 16, borderRadius: 18,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>On time today</div>
            <div className="rx-display" style={{ fontSize: 36, lineHeight: 1, marginTop: 6 }}>87%</div>
          </div>
          <div style={{
            flex: 1, padding: 16, borderRadius: 18,
            background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{ fontSize: 11, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Students moved</div>
            <div className="rx-display" style={{ fontSize: 36, lineHeight: 1, marginTop: 6 }}>4,238</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { NotificationsScreen, SettingsScreen, LoginScreen });
