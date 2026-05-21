// Parent phone sub-screens

// 01 — Family today
function ParentFamily() {
  return (
    <div style={{ background: 'var(--surface)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PhoneHeader greeting="Tuesday, May 19" title="Family today" avatar={
        <span className="rx-avatar" style={{ width: 30, height: 30, background: 'var(--plum-soft)', color: 'var(--plum-ink)', fontSize: 11 }}>HT</span>
      }/>

      {/* Child 1 — onboard */}
      <div style={{ padding: '0 22px 12px' }}>
        <div style={{
          borderRadius: 22, padding: 18,
          background: 'linear-gradient(165deg, var(--plum) 0%, oklch(0.4 0.13 320) 100%)',
          color: 'white', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span className="rx-avatar" style={{ width: 42, height: 42, background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: 15 }}>AT</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Amelia</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Sophomore · Stop: Library</div>
            </div>
            <span className="rx-chip" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderColor: 'transparent' }}>
              <span className="dot" style={{ background: 'var(--live)' }}/>Onboard
            </span>
          </div>

          {/* Trip timeline */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', padding: '0 6px' }}>
            <div style={{ position: 'absolute', left: 14, right: 14, top: 9, height: 2, background: 'rgba(255,255,255,0.2)' }}/>
            <div style={{ position: 'absolute', left: 14, top: 9, height: 2, background: 'rgba(255,255,255,0.95)', width: '46%' }}/>
            {[
              { lbl: 'Picked up', done: true, time: '7:48' },
              { lbl: 'Onboard',   done: true, time: '7:52', active: true },
              { lbl: 'Library',   done: false, time: '8:04' },
              { lbl: 'School',    done: false, time: '8:18' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, position: 'relative', zIndex: 1, width: 64 }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 999,
                  background: s.done ? 'white' : 'transparent',
                  border: s.done ? '0' : '2px solid rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  outline: s.active ? '4px solid rgba(255,255,255,0.25)' : 'none',
                }}>
                  {s.done && <IcCheck size={12} style={{ color: 'var(--plum-ink)' }}/>}
                </span>
                <span style={{ fontSize: 10.5, opacity: 0.85 }}>{s.lbl}</span>
                <span className="rx-mono" style={{ fontSize: 10, opacity: 0.6 }}>{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Child 2 — completed */}
      <div style={{ padding: '0 22px 12px' }}>
        <div style={{
          border: '1px solid var(--border)', borderRadius: 18, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span className="rx-avatar" style={{ width: 42, height: 42, background: 'var(--amber-soft)', color: 'var(--amber-ink)', fontSize: 14 }}>DT</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Daniel</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>Senior · Dropped off at Stadium · 8:02</div>
          </div>
          <span className="rx-chip success"><IcCheck size={11}/>Safe</span>
        </div>
      </div>

      <div style={{ padding: '6px 22px' }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 6 }}>Today</div>
        <ActivityMini i={IcBus}   tone="brand"   t="Amelia boarded B-204"      s="Library · 7:52 AM"/>
        <ActivityMini i={IcCheck} tone="success" t="Daniel arrived at school"  s="Stadium · 8:02 AM"/>
        <ActivityMini i={IcBell}  tone="info"    t="Driver Maya sent a note"   s="Running 2 min early today"/>
      </div>

      <div style={{ flex: 1 }}/>

      <PhoneTabBar tab="home" tabs={[
        { id: 'home',    i: IcUsers,  label: 'Family' },
        { id: 'inbox',   i: IcMsg,    label: 'Inbox' },
        { id: 'alerts',  i: IcBell,   label: 'Alerts' },
        { id: 'profile', i: IcUser,   label: 'Me' },
      ]}/>
    </div>
  );
}

function ActivityMini({ i: I, tone, t, s }) {
  const tones = {
    brand: ['var(--brand-soft)','var(--brand-ink)'],
    success: ['var(--success-soft)','var(--success)'],
    info: ['var(--info-soft)','var(--info)'],
    plum: ['var(--plum-soft)','var(--plum-ink)'],
  };
  const [bg, fg] = tones[tone] || tones.brand;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ width: 30, height: 30, borderRadius: 10, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <I size={14}/>
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{t}</div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{s}</div>
      </div>
    </div>
  );
}

// 02 — Trip detail (per child)
function ParentTrip() {
  return (
    <div style={{ background: 'var(--surface)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top: child summary */}
      <div style={{ padding: '6px 22px 14px' }}>
        <button style={{ height: 28, padding: '0 8px 0 4px', border: 0, background: 'transparent', display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--plum-ink)', cursor: 'default', fontWeight: 500 }}>
          <IcArrowL size={14}/>Family
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
          <span className="rx-avatar" style={{ width: 48, height: 48, background: 'var(--plum-soft)', color: 'var(--plum-ink)', fontSize: 17 }}>AT</span>
          <div style={{ flex: 1 }}>
            <div className="rx-display" style={{ fontSize: 24, lineHeight: 1.1 }}>Amelia · morning trip</div>
            <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>B-204 · Main Loop · Maya Okafor</div>
          </div>
        </div>
      </div>

      {/* Map preview */}
      <div style={{ padding: '0 22px 14px' }}>
        <div style={{
          height: 160, borderRadius: 18, overflow: 'hidden', position: 'relative',
          background: 'oklch(0.94 0.012 165)',
          border: '1px solid var(--border)',
        }}>
          {/* Fake "map" - subtle grid + route line */}
          <svg viewBox="0 0 320 160" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0H0V20" stroke="var(--border)" strokeWidth="0.7" fill="none"/>
              </pattern>
            </defs>
            <rect width="320" height="160" fill="url(#grid)"/>
            {/* Road shapes */}
            <path d="M0 100 Q60 92 120 88 T240 60 L320 50" stroke="oklch(0.92 0.01 80)" strokeWidth="12" fill="none" strokeLinecap="round"/>
            <path d="M40 0 L60 60 L80 160" stroke="oklch(0.92 0.01 80)" strokeWidth="10" fill="none" strokeLinecap="round"/>
            <path d="M180 0 L200 80 L240 160" stroke="oklch(0.92 0.01 80)" strokeWidth="10" fill="none" strokeLinecap="round"/>
            {/* Route line */}
            <path d="M30 130 Q90 110 150 100 Q210 92 260 70 Q290 55 310 30" stroke="var(--plum)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="0"/>
            <path d="M260 70 Q290 55 310 30" stroke="var(--plum)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="4 5" opacity="0.5"/>
            {/* Stops */}
            <circle cx="30" cy="130" r="5" fill="white" stroke="var(--plum)" strokeWidth="2"/>
            <circle cx="150" cy="100" r="5" fill="white" stroke="var(--plum)" strokeWidth="2"/>
            <circle cx="310" cy="30" r="5" fill="white" stroke="var(--plum)" strokeWidth="2"/>
            {/* Bus */}
            <g transform="translate(186, 91)">
              <circle r="14" fill="var(--plum)"/>
              <text textAnchor="middle" y="4" fill="white" fontSize="11" fontWeight="600" fontFamily="ui-sans-serif">204</text>
            </g>
          </svg>
          <span style={{
            position: 'absolute', top: 10, left: 10,
            padding: '4px 9px', borderRadius: 999,
            background: 'rgba(255,255,255,0.92)', fontSize: 10.5, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--plum-ink)',
          }}><span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--live)' }}/>LIVE · 3 min to Library</span>
        </div>
      </div>

      {/* Metric tiles */}
      <div style={{ padding: '0 22px 12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        <TripMetric k="ETA"      v="8:18" tone="plum"/>
        <TripMetric k="Distance" v="1.2 mi"/>
        <TripMetric k="Speed"    v="24 mph"/>
      </div>

      {/* Timeline */}
      <div style={{ padding: '4px 22px 8px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Today's stops</div>
        <Timeline items={[
          { lbl: 'Picked up at home',      time: '7:48', done: true,  sub: '321 Cedar St' },
          { lbl: 'Boarded B-204',          time: '7:52', done: true,  sub: 'Tap-in confirmed', current: true },
          { lbl: 'Arriving at Library',    time: '8:04', done: false, sub: 'Next stop · 3 min', active: true },
          { lbl: 'Walks to school',        time: '8:18', done: false, sub: 'Estimated arrival' },
        ]}/>
      </div>

      <div style={{ padding: '12px 22px 22px', display: 'flex', gap: 10, borderTop: '1px solid var(--border)' }}>
        <button style={{ flex: 1, height: 42, border: 0, borderRadius: 14, background: 'var(--plum)', color: 'white', fontWeight: 600, fontSize: 13.5, cursor: 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <IcMsg size={15}/>Message Maya
        </button>
        <button style={{ width: 46, height: 42, border: '1px solid var(--border)', borderRadius: 14, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
          <IcPhone size={16} style={{ color: 'var(--ink)' }}/>
        </button>
      </div>
    </div>
  );
}

function TripMetric({ k, v, tone }) {
  return (
    <div style={{ padding: 12, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
      <div className="rx-display" style={{ fontSize: 18, color: tone === 'plum' ? 'var(--plum-ink)' : 'var(--ink)', marginTop: 4, lineHeight: 1 }}>{v}</div>
    </div>
  );
}

function Timeline({ items }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 18 }}>
      <div style={{ position: 'absolute', left: 8, top: 7, bottom: 7, width: 1.5, background: 'var(--border)' }}/>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, position: 'relative', paddingBottom: 14 }}>
          <span style={{
            position: 'absolute', left: -18, top: 1,
            width: 17, height: 17, borderRadius: 999,
            background: it.done ? 'var(--plum)' : 'var(--surface)',
            border: it.done ? 0 : `2px solid ${it.active ? 'var(--plum)' : 'var(--border-strong)'}`,
            outline: it.active ? '3px solid var(--plum-soft)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1,
          }}>
            {it.done && <IcCheck size={10} style={{ color: 'white' }}/>}
          </span>
          <div style={{ flex: 1, paddingLeft: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: it.current ? 600 : 500, color: it.done || it.active ? 'var(--ink)' : 'var(--ink-2)' }}>{it.lbl}</span>
              <span className="rx-mono" style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{it.time}</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>{it.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 03 — Inbox
function ParentInbox() {
  return (
    <div style={{ background: 'var(--surface)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <PhoneHeader greeting="3 unread" title="Inbox" avatar={
        <button style={{ width: 32, height: 32, borderRadius: 999, background: 'var(--surface-2)', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcSettings size={15} style={{ color: 'var(--ink-2)' }}/>
        </button>
      }/>

      {/* Filter chips */}
      <div style={{ padding: '0 22px 12px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { l: 'All', a: true, n: 12 },
          { l: 'Drivers', n: 3 },
          { l: 'Alerts', n: 2 },
          { l: 'School', n: 7 },
        ].map(c => (
          <button key={c.l} style={{
            height: 28, padding: '0 11px', border: '1px solid var(--border)',
            borderRadius: 999, background: c.a ? 'var(--plum)' : 'var(--surface)',
            color: c.a ? 'white' : 'var(--ink-2)',
            fontSize: 11.5, fontWeight: 500, cursor: 'default',
            display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>{c.l}<span style={{ opacity: 0.75 }}>{c.n}</span></button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <InboxRow avatar={<span className="rx-avatar" style={{ width: 38, height: 38, background: 'var(--brand-soft)', color: 'var(--brand-ink)', fontSize: 13 }}>MO</span>}
          name="Maya Okafor" sub="Driver · B-204" preview="Running 2 min early — see you at Library." time="now" unread/>
        <InboxRow icon={IcAttn} iconTone="warning" name="Service alert" sub="West Shuttle · R3" preview="B-309 delayed approximately 7 minutes." time="2m" unread/>
        <InboxRow icon={IcCheck} iconTone="success" name="Daniel arrived safely" sub="Stadium · 8:02 AM" preview="Tap to view the full route." time="2h" unread/>
        <InboxRow avatar={<span className="rx-avatar" style={{ width: 38, height: 38, background: 'var(--amber-soft)', color: 'var(--amber-ink)', fontSize: 13 }}>JP</span>}
          name="Jin Park" sub="Driver · B-377" preview="Thanks for letting us know about the appointment." time="Yesterday"/>
        <InboxRow icon={IcCalendar} iconTone="info" name="Aldridge schedule" sub="Spring '26" preview="Final exams shuttle starts May 22 · 6:30 AM." time="Mon"/>
        <InboxRow icon={IcFlag} iconTone="plum" name="Field trip notice" sub="School transport office" preview="Permission slip due Friday for Amelia." time="Mon"/>
      </div>

      <PhoneTabBar tab="inbox" tabs={[
        { id: 'home',    i: IcUsers,  label: 'Family' },
        { id: 'inbox',   i: IcMsg,    label: 'Inbox' },
        { id: 'alerts',  i: IcBell,   label: 'Alerts' },
        { id: 'profile', i: IcUser,   label: 'Me' },
      ]}/>
    </div>
  );
}

function InboxRow({ avatar, icon: I, iconTone, name, sub, preview, time, unread }) {
  const tones = {
    success: ['var(--success-soft)','var(--success)'],
    warning: ['var(--warning-soft)','var(--warning)'],
    info: ['var(--info-soft)','var(--info)'],
    plum: ['var(--plum-soft)','var(--plum-ink)'],
  };
  const tone = tones[iconTone] || tones.info;
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 22px',
      borderBottom: '1px solid var(--border)',
      background: unread ? 'var(--surface)' : 'transparent',
    }}>
      {avatar || (
        <span style={{ width: 38, height: 38, borderRadius: 10, background: tone[0], color: tone[1], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <I size={16}/>
        </span>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: unread ? 600 : 500, color: 'var(--ink)' }}>{name}</div>
            <div style={{ fontSize: 11, color: 'var(--ink-3)' }}>{sub}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span className="rx-mono" style={{ fontSize: 10.5, color: 'var(--ink-3)' }}>{time}</span>
            {unread && <span style={{ width: 7, height: 7, borderRadius: 999, background: 'var(--plum)' }}/>}
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{preview}</div>
      </div>
    </div>
  );
}

Object.assign(window, { ParentFamily, ParentTrip, ParentInbox });
