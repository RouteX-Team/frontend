// Driver phone sub-screens — dark theme

const DRV_BG = '#0F1413';
const DRV_BG_2 = 'rgba(255,255,255,0.06)';
const DRV_BORDER = 'rgba(255,255,255,0.08)';

// 01 — Pre-trip checklist
function DriverPretrip() {
  return (
    <div style={{ background: DRV_BG, color: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 22px 12px' }}>
        <div style={{ fontSize: 12.5, opacity: 0.65 }}>6:42 AM · Tuesday</div>
        <div className="rx-display" style={{ fontSize: 26, lineHeight: 1.1, marginTop: 2 }}>Pre-trip · B-204</div>
        <div style={{ fontSize: 12.5, opacity: 0.65, marginTop: 4 }}>Main Loop · departs 7:30 AM</div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 22px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, opacity: 0.75, marginBottom: 6 }}>
          <span>8 of 12 complete</span>
          <span className="rx-mono">67%</span>
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: '67%', height: '100%', background: 'var(--live)', borderRadius: 999 }}/>
        </div>
      </div>

      {/* Sections */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px' }}>
        <CheckSection label="Exterior" complete={4} total={4} items={[
          { l: 'Tires + tread', d: true },
          { l: 'Lights · headlights & flashers', d: true },
          { l: 'Mirrors + clean glass', d: true },
          { l: 'Emergency exit accessible', d: true },
        ]}/>
        <CheckSection label="Interior" complete={3} total={5} items={[
          { l: 'Seatbelts random sample', d: true },
          { l: 'Fire extinguisher pressure', d: true },
          { l: 'First-aid kit sealed', d: true },
          { l: 'Aisle clear + flooring', d: false, current: true },
          { l: 'Camera + recorder online', d: false },
        ]}/>
        <CheckSection label="Systems" complete={1} total={3} items={[
          { l: 'Battery ≥ 60%', d: true, hint: '86%' },
          { l: 'GPS uplink', d: false },
          { l: 'Dispatch radio test', d: false },
        ]}/>
      </div>

      {/* CTA */}
      <div style={{ padding: '14px 22px 22px', borderTop: `1px solid ${DRV_BORDER}` }}>
        <button style={{
          width: '100%', height: 48, borderRadius: 14, border: 0,
          background: 'var(--live)', color: '#0F1413',
          fontWeight: 700, fontSize: 14, letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'default',
        }}>
          Continue · 4 remaining<IcArrowR size={16}/>
        </button>
      </div>
    </div>
  );
}

function CheckSection({ label, complete, total, items }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
        <span className="rx-mono" style={{ fontSize: 11, opacity: 0.55 }}>{complete}/{total}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {items.map((it, i) => <CheckRow key={i} {...it}/>)}
      </div>
    </div>
  );
}

function CheckRow({ l, d, current, hint }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 14px', borderRadius: 12,
      background: current ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.04)',
      border: current ? '1px solid rgba(255,107,53,0.35)' : '1px solid transparent',
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 7,
        background: d ? 'var(--live)' : 'transparent',
        border: d ? 0 : '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {d && <IcCheck size={13} style={{ color: '#0F1413' }}/>}
      </span>
      <span style={{ flex: 1, fontSize: 13, color: d ? 'rgba(255,255,255,0.85)' : '#fff', textDecoration: d ? 'line-through' : 'none', textDecorationColor: 'rgba(255,255,255,0.4)' }}>{l}</span>
      {hint && <span className="rx-mono" style={{ fontSize: 11, color: 'var(--live)', opacity: 0.9 }}>{hint}</span>}
    </div>
  );
}

// 02 — On route (existing, polished)
function DriverOnRoute() {
  return (
    <div style={{ background: DRV_BG, color: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 22px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.6 }}>Driver · Maya O.</div>
          <div className="rx-display" style={{ fontSize: 22, lineHeight: 1.1 }}>Main Loop · B-204</div>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
          borderRadius: 999, background: 'rgba(255,107,53,0.15)', color: 'var(--live)',
          fontSize: 11, fontWeight: 600,
        }}><span style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--live)' }}/>Live</span>
      </div>

      <div style={{ padding: '0 22px 14px' }}>
        <div style={{
          borderRadius: 22, padding: 20, background: DRV_BG_2,
          border: `1px solid ${DRV_BORDER}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
            <span style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'var(--live)', color: '#0F1413',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><IcNav size={28}/></span>
            <div>
              <div style={{ fontSize: 12, opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.06em' }}>In 0.3 mi</div>
              <div className="rx-display" style={{ fontSize: 24, lineHeight: 1.1 }}>Right onto Lasuen St.</div>
            </div>
          </div>
          <div style={{ height: 1, background: DRV_BORDER, margin: '14px 0' }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Metric label="Next stop"  value="Library" />
            <Metric label="ETA"        value="3 min"  accent="var(--live)"/>
            <Metric label="Speed"      value="24 mph" />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 22px', flex: 1, overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Stops <span style={{ opacity: 0.6, fontWeight: 400 }}>· 2 / 5 done</span></div>
          <a style={{ fontSize: 12, color: 'var(--live)' }}>Manifest</a>
        </div>
        <StopRow lbl="Quad"            time="7:30" status="done"/>
        <StopRow lbl="Science Hill"    time="7:48" status="done"/>
        <StopRow lbl="Library"         time="8:04" status="next" boarders={6}/>
        <StopRow lbl="Stadium"         time="8:15" status="future" boarders={4}/>
        <StopRow lbl="East Gate"       time="8:24" status="future" boarders={2}/>
      </div>

      {/* SOS bar */}
      <div style={{ padding: '12px 22px 22px', display: 'flex', gap: 10, borderTop: `1px solid ${DRV_BORDER}` }}>
        <button style={{
          flex: 1, height: 50, border: 0, borderRadius: 16,
          background: 'rgba(255,255,255,0.08)', color: '#fff',
          fontWeight: 600, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          cursor: 'default',
        }}><IcMsg size={16}/>Dispatch</button>
        <button style={{
          width: 100, height: 50, border: 0, borderRadius: 16,
          background: 'var(--danger)', color: '#fff', cursor: 'default',
          fontWeight: 700, fontSize: 13, letterSpacing: '0.1em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}><IcAttn size={16}/>SOS</button>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div className="rx-display" style={{ fontSize: 20, color: accent || '#fff', marginTop: 2, lineHeight: 1 }}>{value}</div>
    </div>
  );
}

function StopRow({ lbl, time, status, boarders }) {
  const isDone = status === 'done', isNext = status === 'next';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
      borderBottom: `1px solid ${DRV_BORDER}`,
      opacity: status === 'future' ? 0.65 : 1,
    }}>
      <span style={{
        width: 22, height: 22, borderRadius: 999,
        background: isDone ? 'var(--live)' : isNext ? 'transparent' : 'transparent',
        border: isDone ? 0 : isNext ? '2px solid var(--live)' : '1.5px solid rgba(255,255,255,0.25)',
        outline: isNext ? '4px solid rgba(255,107,53,0.18)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isDone && <IcCheck size={11} style={{ color: '#0F1413' }}/>}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: isNext ? 600 : 500 }}>{lbl}</div>
        {boarders != null && <div style={{ fontSize: 11, opacity: 0.65 }}>{boarders} expected boarders</div>}
        {isDone && <div style={{ fontSize: 11, opacity: 0.65 }}>On time</div>}
      </div>
      <span className="rx-mono" style={{ fontSize: 13, color: isNext ? 'var(--live)' : '#fff', opacity: isNext ? 1 : 0.65 }}>{time}</span>
    </div>
  );
}

// 03 — Manifest (full list by stop)
function DriverManifest() {
  return (
    <div style={{ background: DRV_BG, color: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '6px 22px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button style={{ width: 32, height: 32, borderRadius: 999, background: DRV_BG_2, color: '#fff', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IcArrowL size={16}/>
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11.5, opacity: 0.65 }}>Manifest</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>B-204 · Main Loop</div>
        </div>
        <span style={{
          height: 32, padding: '0 12px', borderRadius: 999,
          background: 'var(--live)', color: '#0F1413',
          fontSize: 12, fontWeight: 700,
          display: 'inline-flex', alignItems: 'center',
        }}>28<span style={{ opacity: 0.6, marginLeft: 3, fontWeight: 500 }}>/42</span></span>
      </div>

      {/* Summary tiles */}
      <div style={{ padding: '0 22px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <SumTile k="Onboard" v="28" tone="live"/>
        <SumTile k="Boarding" v="6"/>
        <SumTile k="Absent" v="1" tone="warn"/>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '0 22px 10px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {['All stops', 'Library', 'Stadium', 'East Gate'].map((c, i) => (
          <button key={c} style={{
            height: 28, padding: '0 11px', borderRadius: 999,
            background: i === 0 ? 'var(--live)' : DRV_BG_2,
            color: i === 0 ? '#0F1413' : 'rgba(255,255,255,0.75)',
            border: 0, fontSize: 11.5, fontWeight: 500, cursor: 'default',
            flexShrink: 0,
          }}>{c}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0 22px' }}>
        <StopGroup label="Library · arriving 8:04" badge="6 to board">
          <PaxRow name="Amelia Tran"      id="S001" state="onboard"/>
          <PaxRow name="Carlos Mendes"    id="S002" state="boarding"/>
          <PaxRow name="Olu Adeyemi"      id="S008" state="boarding"/>
          <PaxRow name="Priya Ananth"     id="S005" state="onboard"/>
        </StopGroup>

        <StopGroup label="Stadium · 8:15" badge="4 to board">
          <PaxRow name="Dmitri Volkov"    id="S004" state="onboard"/>
          <PaxRow name="Sienna Bell"      id="S003" state="boarding"/>
          <PaxRow name="Eli Brennan"      id="S006" state="absent"/>
        </StopGroup>

        <StopGroup label="East Gate · 8:24" badge="2 to board">
          <PaxRow name="Yuki Tanaka"      id="S007" state="boarding"/>
        </StopGroup>
      </div>
    </div>
  );
}

function SumTile({ k, v, tone }) {
  const c = tone === 'live' ? 'var(--live)' : tone === 'warn' ? 'var(--warning)' : '#fff';
  return (
    <div style={{ padding: 11, borderRadius: 12, background: DRV_BG_2, border: `1px solid ${DRV_BORDER}` }}>
      <div style={{ fontSize: 10, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{k}</div>
      <div className="rx-display" style={{ fontSize: 22, color: c, lineHeight: 1, marginTop: 4 }}>{v}</div>
    </div>
  );
}

function StopGroup({ label, badge, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: 10.5, color: 'var(--live)', fontWeight: 500 }}>{badge}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function PaxRow({ name, id, state }) {
  const a = avatarFor(name);
  const stateMap = {
    onboard:  { lbl: 'Onboard',  bg: 'rgba(255,107,53,0.15)', fg: 'var(--live)',  icon: IcCheck },
    boarding: { lbl: 'Expected', bg: 'rgba(255,255,255,0.08)', fg: 'rgba(255,255,255,0.7)', icon: IcClock },
    absent:   { lbl: 'Absent',   bg: 'rgba(232,93,72,0.18)',   fg: 'oklch(0.75 0.16 25)', icon: IcClose },
  };
  const st = stateMap[state];
  const I = st.icon;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px', borderRadius: 12,
      background: 'rgba(255,255,255,0.04)', marginBottom: 5,
    }}>
      <span className="rx-avatar" style={{ width: 32, height: 32, background: a.bg, color: a.fg, fontSize: 11 }}>{initialsOf(name)}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div className="rx-mono" style={{ fontSize: 10.5, opacity: 0.55 }}>{id}</div>
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '4px 9px', borderRadius: 999,
        background: st.bg, color: st.fg, fontSize: 11, fontWeight: 500,
      }}>
        <I size={11}/>{st.lbl}
      </span>
    </div>
  );
}

Object.assign(window, { DriverPretrip, DriverOnRoute, DriverManifest });
