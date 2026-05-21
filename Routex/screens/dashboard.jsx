// Admin dashboard — analytics widgets

function DashboardScreen() {
  return (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <KpiCard icon={IcBus}   label="Total buses"     value="6"    delta="+0"   tone="brand" sub="5 active · 1 idle" />
        <KpiCard icon={IcRoute} label="Active trips"    value="23"   delta="+4"   tone="live"  sub="4 routes" />
        <KpiCard icon={IcClock} label="Delayed buses"   value="1"    delta="−2"   tone="warning" sub="avg delay 7 min" deltaGood />
        <KpiCard icon={IcUsers} label="Students onboard" value="198" delta="+38"  tone="plum"  sub="of 4,912 enrolled" deltaGood />
      </div>

      {/* Row 2: chart + on-time */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--gap)' }}>
        <RidershipChart />
        <OnTimePerformance />
      </div>

      {/* Row 3: routes + drivers */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--gap)' }}>
        <RouteSummary />
        <DriverActivity />
      </div>

      {/* Row 4: timeline + heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--gap)' }}>
        <ActivityTimeline />
        <DemandHeatmap />
      </div>
    </div>
  );
}

function KpiCard({ icon: I, label, value, delta, sub, tone, deltaGood }) {
  const toneMap = {
    brand:   { bg: 'var(--brand-soft)',   fg: 'var(--brand-ink)' },
    live:    { bg: 'var(--live-soft)',    fg: 'var(--live-ink)'  },
    plum:    { bg: 'var(--plum-soft)',    fg: 'var(--plum-ink)'  },
    warning: { bg: 'var(--warning-soft)', fg: 'var(--warning)'   },
    amber:   { bg: 'var(--amber-soft)',   fg: 'var(--amber-ink)' },
  };
  const t = toneMap[tone] || toneMap.brand;
  const up = delta.startsWith('+');
  const good = deltaGood !== undefined ? deltaGood : up;
  return (
    <div className="rx-card rx-card-pad" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: t.bg, color: t.fg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <I size={18} />
        </div>
        <span className="rx-chip" style={{
          background: good ? 'var(--success-soft)' : 'var(--danger-soft)',
          color: good ? 'var(--success)' : 'var(--danger)',
          borderColor: 'transparent', height: 22,
        }}>
          {good ? <IcTrendUp size={11} /> : <IcTrendDown size={11} />}
          {delta}
        </span>
      </div>
      <div>
        <div className="rx-label" style={{ fontSize: 11, marginBottom: 4 }}>{label}</div>
        <div className="rx-display" style={{ fontSize: 38, lineHeight: 1, color: 'var(--ink)' }}>{value}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{sub}</div>
      </div>
    </div>
  );
}

// Ridership chart — area with gradient
function RidershipChart() {
  const data = [120, 180, 380, 612, 720, 480, 280, 320, 540, 690, 580, 320, 180];
  const labels = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p'];
  const max = 800;
  const W = 720, H = 220, P = { l: 36, r: 16, t: 18, b: 28 };
  const innerW = W - P.l - P.r, innerH = H - P.t - P.b;
  const x = i => P.l + (i / (data.length - 1)) * innerW;
  const y = v => P.t + innerH - (v / max) * innerH;
  const linePath = data.map((v,i) => `${i===0?'M':'L'}${x(i)},${y(v)}`).join(' ');
  const areaPath = `${linePath} L${x(data.length-1)},${P.t+innerH} L${x(0)},${P.t+innerH} Z`;

  return (
    <div className="rx-card rx-card-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>
          <div className="rx-label" style={{ marginBottom: 4 }}>Ridership today</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span className="rx-display" style={{ fontSize: 32 }}>4,238</span>
            <span style={{ fontSize: 13, color: 'var(--success)' }}>▲ 12.4% vs avg</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 3, background: 'var(--surface-2)', borderRadius: 'var(--r-sm)' }}>
          {['Day','Week','Month'].map((l, i) => (
            <button key={l} style={{
              height: 26, padding: '0 12px', border: 0, borderRadius: 6,
              background: i === 0 ? 'var(--surface)' : 'transparent',
              boxShadow: i === 0 ? 'var(--shadow-sm)' : 'none',
              fontSize: 11.5, fontWeight: 500, color: i === 0 ? 'var(--ink)' : 'var(--ink-3)',
              cursor: 'default',
            }}>{l}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 220 }}>
        <defs>
          <linearGradient id="rxArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.35"/>
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map(g => (
          <line key={g} x1={P.l} x2={W-P.r} y1={P.t + innerH*g} y2={P.t + innerH*g}
            stroke="var(--border)" strokeWidth="1" strokeDasharray={g===1?'0':'2 4'} />
        ))}
        {/* y labels */}
        {[800, 600, 400, 200, 0].map((v,i) => (
          <text key={v} x={P.l-8} y={P.t + (i/4)*innerH + 4} fontSize="10" fill="var(--ink-3)" textAnchor="end">{v}</text>
        ))}
        {/* area + line */}
        <path d={areaPath} fill="url(#rxArea)" />
        <path d={linePath} stroke="var(--brand)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        {/* dots + x labels */}
        {data.map((v,i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(v)} r={i === 4 ? 4 : 2.4} fill="var(--surface)" stroke="var(--brand)" strokeWidth="2"/>
            <text x={x(i)} y={H-8} fontSize="10" fill="var(--ink-3)" textAnchor="middle">{labels[i]}</text>
          </g>
        ))}
        {/* peak callout */}
        <g transform={`translate(${x(4)}, ${y(data[4])-12})`}>
          <rect x="-22" y="-22" width="44" height="20" rx="6" fill="var(--ink)" />
          <text x="0" y="-9" fontSize="10.5" fill="var(--bg)" textAnchor="middle" fontWeight="500">peak · 720</text>
        </g>
      </svg>
    </div>
  );
}

function OnTimePerformance() {
  const pct = 87;
  const C = 2 * Math.PI * 64;
  return (
    <div className="rx-card rx-card-pad" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="rx-label">On-time performance</div>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 14 }}>
        <svg width="170" height="170" viewBox="0 0 170 170" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="85" cy="85" r="64" fill="none" stroke="var(--surface-2)" strokeWidth="14" />
          <circle cx="85" cy="85" r="64" fill="none" stroke="var(--brand)" strokeWidth="14"
            strokeDasharray={`${(pct/100)*C} ${C}`} strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', textAlign: 'center' }}>
          <div className="rx-display" style={{ fontSize: 40, color: 'var(--ink)', lineHeight: 1 }}>{pct}<span style={{ fontSize: 18, color: 'var(--ink-3)' }}>%</span></div>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 }}>today</div>
        </div>
      </div>
      <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <PerfRow label="On time"   value="174 trips" pct={87}  color="var(--brand)" />
        <PerfRow label="≤ 5 min late" value="22 trips"  pct={11} color="var(--warning)" />
        <PerfRow label="> 5 min late" value="4 trips"   pct={2}  color="var(--danger)"  />
      </div>
    </div>
  );
}

function PerfRow({ label, value, pct, color }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
        <span style={{ color: 'var(--ink-2)' }}>{label}</span>
        <span style={{ color: 'var(--ink-3)' }}>{value}</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999 }}/>
      </div>
    </div>
  );
}

function RouteSummary() {
  return (
    <div className="rx-card rx-card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="rx-label">Route performance</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>All routes · today</div>
        </div>
        <button className="rx-btn ghost sm">View all<IcChev size={13}/></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ROUTES.map((r, i) => {
          const trips = [8, 6, 5, 4][i];
          const onTime = [94, 88, 76, 92][i];
          return (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '14px 1fr auto auto', alignItems: 'center', gap: 14 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: r.color }} />
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.id} · {r.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.stops.length} stops · {trips} trips</div>
              </div>
              <div style={{ width: 110 }}>
                <div style={{ height: 5, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: `${onTime}%`, height: '100%', background: r.color, borderRadius: 999 }}/>
                </div>
              </div>
              <div className="rx-mono" style={{ fontSize: 12.5, color: 'var(--ink-2)', minWidth: 40, textAlign: 'right' }}>{onTime}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DriverActivity() {
  const active = DRIVERS.filter(d => d.status === 'active');
  return (
    <div className="rx-card rx-card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="rx-label">Driver activity</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>{active.length} on shift now</div>
        </div>
        <button className="rx-btn ghost sm">Manage<IcChev size={13}/></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {active.slice(0, 5).map(d => {
          const a = avatarFor(d.name);
          const route = ROUTES.find(r => r.id === d.route);
          return (
            <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="rx-avatar" style={{ background: a.bg, color: a.fg }}>{initialsOf(d.name)}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.name}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{route?.name || '—'} · {d.shift} shift</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--ink-2)' }}>
                <IcStar size={12} style={{ color: 'var(--amber)' }} /> {d.rating}
              </div>
              <span className="rx-chip live" style={{ height: 20, padding: '0 7px', fontSize: 10.5 }}><span className="dot"/>On shift</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActivityTimeline() {
  const events = [
    { t: '14:42', who: 'B-204', what: 'arrived at Library',       tone: 'success', icon: IcPin },
    { t: '14:38', who: 'B-117', what: 'departed Memorial Aud.',   tone: 'brand',   icon: IcArrowR },
    { t: '14:35', who: 'B-309', what: 'flagged delay · +7 min',   tone: 'warning', icon: IcWarn },
    { t: '14:31', who: 'Dispatch', what: 'rerouted B-309 via 2nd', tone: 'info',   icon: IcRoute },
    { t: '14:28', who: 'B-451', what: 'completed trip · 36 rides', tone: 'plum',  icon: IcCheck },
    { t: '14:24', who: 'B-128', what: 'returned to depot',         tone: 'ink',   icon: IcBus },
  ];
  const toneFor = {
    success: ['var(--success-soft)','var(--success)'],
    brand:   ['var(--brand-soft)','var(--brand-ink)'],
    warning: ['var(--warning-soft)','var(--warning)'],
    info:    ['var(--info-soft)','var(--info)'],
    plum:    ['var(--plum-soft)','var(--plum-ink)'],
    ink:     ['var(--surface-2)','var(--ink-2)'],
  };
  return (
    <div className="rx-card rx-card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="rx-label">Live activity</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Last 30 minutes</div>
        </div>
        <span className="rx-chip live" style={{ height: 22 }}><span className="dot"/>Streaming</span>
      </div>
      <div style={{ position: 'relative', paddingLeft: 22 }}>
        <div style={{ position: 'absolute', left: 13, top: 14, bottom: 6, width: 1, background: 'var(--border)' }} />
        {events.map((e, i) => {
          const [bg, fg] = toneFor[e.tone];
          const I = e.icon;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, paddingBottom: i === events.length-1 ? 0 : 14, position: 'relative' }}>
              <span style={{
                position: 'absolute', left: -22, top: 2,
                width: 26, height: 26, borderRadius: 999,
                background: bg, color: fg, border: '2px solid var(--surface)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <I size={13} />
              </span>
              <div style={{ flex: 1, paddingLeft: 14 }}>
                <div style={{ fontSize: 13 }}>
                  <span style={{ fontWeight: 600 }}>{e.who}</span>
                  <span style={{ color: 'var(--ink-2)' }}> {e.what}</span>
                </div>
                <div className="rx-mono" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 2 }}>{e.t}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DemandHeatmap() {
  // 5 rows × 14 cols
  const cols = 14, rows = 5;
  const stops = ['Quad', 'Library', 'Sci Hill', 'Stadium', 'East Gate'];
  // Generate stable values
  const grid = Array.from({ length: rows }, (_, r) =>
    Array.from({ length: cols }, (_, c) => {
      // peaks at 8am (c=2) and 4pm (c=10)
      const peak1 = Math.exp(-((c-2)**2)/4);
      const peak2 = Math.exp(-((c-10)**2)/5);
      const base = (peak1 * 0.9 + peak2 * 0.8) * (0.5 + Math.sin(r*1.3 + c*0.4)*0.25 + 0.5);
      return Math.min(1, base + (((r*13 + c*7) % 17) / 200));
    })
  );
  const labels = ['6a','7a','8a','9a','10a','11a','12p','1p','2p','3p','4p','5p','6p','7p'];
  return (
    <div className="rx-card rx-card-pad">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <div className="rx-label">Demand heatmap</div>
          <div style={{ fontSize: 13, color: 'var(--ink-3)', marginTop: 2 }}>Stops × hours · boarding count</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--ink-3)' }}>
          Low
          <span style={{ display: 'inline-flex' }}>
            {[0.1, 0.3, 0.5, 0.7, 0.9].map(v => (
              <span key={v} style={{ width: 14, height: 10, background: `oklch(0.62 ${0.04 + v*0.12} 165 / ${0.15 + v*0.85})` }}/>
            ))}
          </span>
          High
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `64px repeat(${cols}, 1fr)`, gap: 4 }}>
        <div />
        {labels.map(l => <div key={l} style={{ fontSize: 9.5, color: 'var(--ink-3)', textAlign: 'center' }}>{l}</div>)}
        {grid.map((row, r) => (
          <React.Fragment key={r}>
            <div style={{ fontSize: 11.5, color: 'var(--ink-2)', display: 'flex', alignItems: 'center' }}>{stops[r]}</div>
            {row.map((v, c) => (
              <div key={c} style={{
                aspectRatio: '1.4 / 1',
                background: `oklch(0.62 ${0.04 + v*0.12} 165 / ${0.12 + v*0.88})`,
                borderRadius: 4,
                position: 'relative',
              }} title={`${stops[r]} · ${labels[c]} · ${Math.round(v*120)} boardings`}/>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
