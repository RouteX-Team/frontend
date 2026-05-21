// Table-style admin screens: routes, fleet, drivers, students

function PageWrap({ children }) {
  return <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 'var(--gap)' }}>{children}</div>;
}

function TableShell({ title, sub, children, filters }) {
  return (
    <div className="rx-card" style={{ overflow: 'hidden' }}>
      <div style={{ padding: 'var(--pad-card)', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
          {sub && <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 3 }}>{sub}</div>}
        </div>
        {filters}
      </div>
      <div style={{ overflowX: 'auto' }}>{children}</div>
    </div>
  );
}

function RouteChip({ id }) {
  const r = ROUTES.find(x => x.id === id);
  if (!r) return <span style={{ color: 'var(--ink-3)' }}>—</span>;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5 }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: r.color }}/>
      {r.id} · {r.name}
    </span>
  );
}

function StatusChip({ status }) {
  if (status === 'live')    return <span className="rx-chip live"><span className="dot"/>Live</span>;
  if (status === 'delayed') return <span className="rx-chip warning">Delayed</span>;
  if (status === 'idle')    return <span className="rx-chip">Idle</span>;
  if (status === 'active')  return <span className="rx-chip success"><IcCheck size={11}/>Active</span>;
  if (status === 'standby') return <span className="rx-chip info">Standby</span>;
  if (status === 'off')     return <span className="rx-chip">Off-duty</span>;
  if (status === 'onboard') return <span className="rx-chip brand"><IcBus size={11}/>Onboard</span>;
  if (status === 'waiting') return <span className="rx-chip info"><IcClock size={11}/>Waiting</span>;
  if (status === 'dropped') return <span className="rx-chip success"><IcCheck size={11}/>Dropped off</span>;
  if (status === 'absent')  return <span className="rx-chip danger">Absent</span>;
  return <span className="rx-chip">{status}</span>;
}

// ── Routes ──────────────────────────────────────────────────────────────
function RoutesScreen() {
  return (
    <PageWrap>
      <TableShell
        title="All routes"
        sub="4 routes · 87 stops · operating Mon–Sat"
        filters={
          <>
            <div style={{ position: 'relative', width: 240 }}>
              <IcSearch size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}/>
              <input className="rx-input" placeholder="Search routes…" style={{ width: '100%', paddingLeft: 32 }}/>
            </div>
            <button className="rx-btn"><IcSort size={14}/>Sort</button>
          </>
        }>
        <table className="rx-table">
          <thead><tr>
            <th style={{ width: 36 }}><input type="checkbox" style={{ accentColor: 'var(--brand)' }}/></th>
            <th>Route</th>
            <th>Stops</th>
            <th>Buses</th>
            <th>Trips today</th>
            <th>On-time</th>
            <th>Status</th>
            <th style={{ width: 50 }}/>
          </tr></thead>
          <tbody>
            {ROUTES.map((r, i) => {
              const trips = [8, 6, 5, 4][i];
              const onTime = [94, 88, 76, 92][i];
              const busCount = BUSES.filter(b => b.route === r.id).length;
              return (
                <tr key={r.id}>
                  <td><input type="checkbox" style={{ accentColor: 'var(--brand)' }}/></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10, background: `${r.color}1f`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IcRoute size={18} style={{ color: r.color }}/>
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{r.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{r.id} · loop</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 280 }}>
                      {r.stops.slice(0, 3).map(s => <span key={s} className="rx-chip" style={{ height: 20, fontSize: 11 }}>{s}</span>)}
                      {r.stops.length > 3 && <span style={{ fontSize: 11, color: 'var(--ink-3)', alignSelf: 'center' }}>+{r.stops.length-3} more</span>}
                    </div>
                  </td>
                  <td className="rx-mono" style={{ fontSize: 13 }}>{busCount}</td>
                  <td className="rx-mono" style={{ fontSize: 13 }}>{trips}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 130 }}>
                      <div style={{ flex: 1, height: 5, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${onTime}%`, height: '100%', background: onTime > 90 ? 'var(--success)' : onTime > 80 ? 'var(--brand)' : 'var(--warning)', borderRadius: 999 }}/>
                      </div>
                      <span className="rx-mono" style={{ fontSize: 12 }}>{onTime}%</span>
                    </div>
                  </td>
                  <td><span className="rx-chip success"><span className="dot" style={{ background: 'var(--success)' }}/>Operating</span></td>
                  <td><button className="rx-btn sm icon ghost"><IcMore size={15}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableShell>
    </PageWrap>
  );
}

// ── Fleet ──────────────────────────────────────────────────────────────
function FleetScreen() {
  return (
    <PageWrap>
      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <FleetStat label="In service"     value="5" tone="success" sub="of 6 buses"/>
        <FleetStat label="Avg occupancy"  value="64%" tone="brand"  sub="across active"/>
        <FleetStat label="Miles today"    value="284" tone="amber"  sub="combined fleet"/>
        <FleetStat label="Battery avg"    value="78%" tone="info"   sub="electric units"/>
      </div>

      <TableShell title="Fleet roster" sub="6 vehicles · last inspection: 4 days ago"
        filters={<button className="rx-btn"><IcFilter size={14}/>All buses</button>}>
        <table className="rx-table">
          <thead><tr>
            <th>Vehicle</th>
            <th>Route</th>
            <th>Driver</th>
            <th>Occupancy</th>
            <th>Speed</th>
            <th>Battery</th>
            <th>Status</th>
            <th style={{ width: 50 }}/>
          </tr></thead>
          <tbody>
            {BUSES.map(b => (
              <tr key={b.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 10, background: 'var(--surface-2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '1px solid var(--border)',
                    }}>
                      <IcBus size={18} style={{ color: 'var(--brand)' }}/>
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5 }}>Bus {b.label}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }} className="rx-mono">{b.plate}</div>
                    </div>
                  </div>
                </td>
                <td><RouteChip id={b.route}/></td>
                <td style={{ fontSize: 13 }}>{b.driver}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 130 }}>
                    <div style={{ flex: 1, height: 5, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${(b.students/b.capacity)*100}%`, height: '100%', background: 'var(--brand)', borderRadius: 999 }}/>
                    </div>
                    <span className="rx-mono" style={{ fontSize: 12 }}>{b.students}/{b.capacity}</span>
                  </div>
                </td>
                <td className="rx-mono" style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{b.speed} mph</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <IcBattery size={14} style={{ color: b.battery > 50 ? 'var(--success)' : b.battery > 25 ? 'var(--warning)' : 'var(--danger)' }}/>
                    <span className="rx-mono" style={{ fontSize: 12.5 }}>{b.battery}%</span>
                  </span>
                </td>
                <td><StatusChip status={b.status}/></td>
                <td><button className="rx-btn sm icon ghost"><IcMore size={15}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableShell>
    </PageWrap>
  );
}

function FleetStat({ label, value, tone, sub }) {
  const tones = {
    brand: 'var(--brand-ink)', success: 'var(--success)',
    amber: 'var(--amber-ink)', info: 'var(--info)',
  };
  return (
    <div className="rx-card rx-card-pad">
      <div className="rx-label" style={{ marginBottom: 6 }}>{label}</div>
      <div className="rx-display" style={{ fontSize: 30, color: tones[tone], lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 6 }}>{sub}</div>
    </div>
  );
}

// ── Drivers ──────────────────────────────────────────────────────────
function DriversScreen() {
  return (
    <PageWrap>
      <TableShell title="Driver roster" sub="8 drivers · 6 on shift"
        filters={<button className="rx-btn"><IcFilter size={14}/>All shifts</button>}>
        <table className="rx-table">
          <thead><tr>
            <th>Driver</th>
            <th>Route</th>
            <th>Shift</th>
            <th>Total trips</th>
            <th>Rating</th>
            <th>Status</th>
            <th style={{ width: 50 }}/>
          </tr></thead>
          <tbody>
            {DRIVERS.map(d => {
              const a = avatarFor(d.name);
              return (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="rx-avatar" style={{ background: a.bg, color: a.fg, width: 36, height: 36, fontSize: 13 }}>{initialsOf(d.name)}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{d.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }} className="rx-mono">{d.id} · CDL-A</div>
                      </div>
                    </div>
                  </td>
                  <td><RouteChip id={d.route}/></td>
                  <td><span className="rx-chip">{d.shift}</span></td>
                  <td className="rx-mono" style={{ fontSize: 13 }}>{d.trips}</td>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <IcStar size={12} style={{ color: 'var(--amber)' }}/>
                      <span className="rx-mono" style={{ fontSize: 12.5 }}>{d.rating.toFixed(1)}</span>
                    </span>
                  </td>
                  <td><StatusChip status={d.status}/></td>
                  <td><button className="rx-btn sm icon ghost"><IcMore size={15}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableShell>
    </PageWrap>
  );
}

// ── Students ────────────────────────────────────────────────────────
function StudentsScreen() {
  return (
    <PageWrap>
      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--gap)' }}>
        <FleetStat label="Enrolled"    value="4,912" tone="brand"   sub="this term"/>
        <FleetStat label="Onboard now" value="198"   tone="success" sub="across 5 buses"/>
        <FleetStat label="Waiting"     value="42"    tone="info"    sub="at 8 stops"/>
        <FleetStat label="Absent"      value="7"     tone="amber"   sub="marked today"/>
      </div>

      <TableShell title="Students" sub="Today's roll · filtered to active routes"
        filters={
          <>
            <div style={{ position: 'relative', width: 240 }}>
              <IcSearch size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-3)' }}/>
              <input className="rx-input" placeholder="Search by name or ID…" style={{ width: '100%', paddingLeft: 32 }}/>
            </div>
            <button className="rx-btn"><IcFilter size={14}/>Route</button>
          </>
        }>
        <table className="rx-table">
          <thead><tr>
            <th style={{ width: 36 }}><input type="checkbox" style={{ accentColor: 'var(--brand)' }}/></th>
            <th>Student</th>
            <th>Grade</th>
            <th>Route</th>
            <th>Stop</th>
            <th>Guardian</th>
            <th>Status</th>
            <th style={{ width: 50 }}/>
          </tr></thead>
          <tbody>
            {STUDENTS.map(s => {
              const a = avatarFor(s.name);
              return (
                <tr key={s.id}>
                  <td><input type="checkbox" style={{ accentColor: 'var(--brand)' }}/></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="rx-avatar" style={{ background: a.bg, color: a.fg, width: 34, height: 34, fontSize: 12 }}>{initialsOf(s.name)}</span>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 13.5 }}>{s.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--ink-3)' }} className="rx-mono">{s.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--ink-2)' }}>{s.grade}</td>
                  <td><RouteChip id={s.route}/></td>
                  <td style={{ fontSize: 13, color: 'var(--ink-2)' }}>{s.stop}</td>
                  <td style={{ fontSize: 13, color: 'var(--ink-2)' }}>{s.guardian}</td>
                  <td><StatusChip status={s.status}/></td>
                  <td><button className="rx-btn sm icon ghost"><IcMore size={15}/></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TableShell>
    </PageWrap>
  );
}

window.RoutesScreen = RoutesScreen;
window.FleetScreen = FleetScreen;
window.DriversScreen = DriversScreen;
window.StudentsScreen = StudentsScreen;
