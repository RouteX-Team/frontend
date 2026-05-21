// Live tracking screen — Leaflet map with animated buses + side panel

function TrackingScreen({ onToast }) {
  const mapRef = React.useRef(null);
  const leafletRef = React.useRef({ map: null, markers: {}, polylines: {}, stops: [], tile: null });
  const [theme, setTheme] = React.useState(() => document.documentElement.getAttribute('data-theme') || 'light');
  const [buses, setBuses] = React.useState(() => BUSES.map(b => ({ ...b })));
  const [selectedId, setSelectedId] = React.useState('B-204');
  const [routeFilter, setRouteFilter] = React.useState('all');
  const [followLive, setFollowLive] = React.useState(false);

  // Re-read theme from html attr
  React.useEffect(() => {
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute('data-theme') || 'light');
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  // Init map
  React.useEffect(() => {
    if (!window.L || !mapRef.current || leafletRef.current.map) return;
    const map = L.map(mapRef.current, {
      center: [CAMPUS.lat, CAMPUS.lng],
      zoom: 15,
      zoomControl: true,
      attributionControl: true,
    });
    leafletRef.current.map = map;

    // Draw stops + route polylines
    ROUTES.forEach(route => {
      const pl = L.polyline(route.points, {
        color: route.color, weight: 4, opacity: 0.85, lineCap: 'round', lineJoin: 'round',
        dashArray: null,
      }).addTo(map);
      leafletRef.current.polylines[route.id] = pl;
      route.points.slice(0, route.stops.length).forEach((p, i) => {
        const m = L.marker(p, {
          icon: L.divIcon({
            className: '',
            html: `<div class="rx-stop-pin" style="border-color:${route.color}"></div>`,
            iconSize: [14, 14], iconAnchor: [7, 7],
          }),
        }).addTo(map).bindTooltip(`<b>${route.stops[i]}</b><br/>${route.name}`, {
          direction: 'top', offset: [0, -8], className: 'rx-stop-tip',
        });
        leafletRef.current.stops.push(m);
      });
    });

    // Tiles
    setTile(map, theme);

    setTimeout(() => map.invalidateSize(), 80);
    setTimeout(() => map.invalidateSize(), 400);

    return () => { map.remove(); leafletRef.current.map = null; };
  }, []);

  // Swap tile on theme change
  React.useEffect(() => {
    if (leafletRef.current.map) setTile(leafletRef.current.map, theme);
  }, [theme]);

  function setTile(map, themeMode) {
    if (leafletRef.current.tile) map.removeLayer(leafletRef.current.tile);
    const url = themeMode === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    leafletRef.current.tile = L.tileLayer(url, {
      maxZoom: 19,
      attribution: '&copy; OSM · CARTO',
      subdomains: 'abcd',
    }).addTo(map);
  }

  // Animate buses
  React.useEffect(() => {
    const id = setInterval(() => {
      setBuses(prev => prev.map(b => {
        if (b.status !== 'live') return b;
        const route = ROUTES.find(r => r.id === b.route);
        const speedFactor = 0.0008 * (b.speed / 20); // progress per tick
        const t = (b.t + speedFactor) % 1;
        return { ...b, t };
      }));
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Update markers from buses state
  React.useEffect(() => {
    const map = leafletRef.current.map; if (!map) return;
    buses.forEach(b => {
      const route = ROUTES.find(r => r.id === b.route);
      if (!route) return;
      const pos = b.status === 'idle'
        ? { lat: route.points[0][0], lng: route.points[0][1], heading: 0 }
        : pointAlong(route, b.t);
      const existing = leafletRef.current.markers[b.id];
      const icon = L.divIcon({
        className: '',
        html: `
          <div class="rx-bus-pin ${b.status}" style="${selectedId === b.id ? 'transform:rotate(-45deg) scale(1.18);box-shadow:0 0 0 4px var(--brand-soft), var(--shadow);' : ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="4" width="16" height="13" rx="2.5"/>
              <path d="M4 11h16"/>
              <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none"/>
              <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none"/>
            </svg>
          </div>
        `,
        iconSize: [36, 36], iconAnchor: [18, 18],
      });
      if (existing) {
        existing.setLatLng([pos.lat, pos.lng]);
        existing.setIcon(icon);
      } else {
        const m = L.marker([pos.lat, pos.lng], { icon, zIndexOffset: 100 }).addTo(map);
        m.on('click', () => setSelectedId(b.id));
        leafletRef.current.markers[b.id] = m;
      }
    });

    // Follow selected
    if (followLive && selectedId) {
      const b = buses.find(x => x.id === selectedId);
      if (b) {
        const route = ROUTES.find(r => r.id === b.route);
        const p = pointAlong(route, b.t);
        map.panTo([p.lat, p.lng], { animate: true, duration: 0.4 });
      }
    }
  }, [buses, selectedId, followLive]);

  const visible = buses.filter(b => routeFilter === 'all' || b.route === routeFilter);
  const selected = buses.find(b => b.id === selectedId);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--topbar-h))' }}>
      {/* Map */}
      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <div ref={mapRef} style={{ position: 'absolute', inset: 0 }} />

        {/* Overlay top-left: live indicator */}
        <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 401, display: 'flex', gap: 10 }}>
          <div className="rx-card" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: 'var(--shadow)' }}>
            <span className="rx-chip live" style={{ height: 22, padding: '0 8px' }}><span className="dot"/>Live</span>
            <span style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
              {visible.filter(b => b.status === 'live').length} buses · updated 1s ago
            </span>
          </div>
        </div>

        {/* Overlay top-right: filter */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 401, display: 'flex', gap: 8 }}>
          <div className="rx-card" style={{ padding: 4, display: 'flex', gap: 2, boxShadow: 'var(--shadow)' }}>
            {[{id:'all',label:'All'}, ...ROUTES.map(r => ({id: r.id, label: r.id, color: r.color}))].map(o => {
              const A = routeFilter === o.id;
              return (
                <button key={o.id} onClick={() => setRouteFilter(o.id)} style={{
                  height: 30, padding: '0 12px', border: 0, borderRadius: 'var(--r-xs)',
                  background: A ? 'var(--brand-soft)' : 'transparent',
                  color: A ? 'var(--brand-ink)' : 'var(--ink-2)',
                  fontWeight: A ? 600 : 500, fontSize: 12.5, cursor: 'default',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  {o.color && <span style={{ width: 8, height: 8, borderRadius: 999, background: o.color }} />}
                  {o.label}
                </button>
              );
            })}
          </div>
          <button className="rx-btn sm icon" style={{ boxShadow: 'var(--shadow-sm)' }} title="Recenter"
            onClick={() => leafletRef.current.map?.setView([CAMPUS.lat, CAMPUS.lng], 15, { animate: true })}>
            <IcNav size={15} />
          </button>
        </div>

        {/* Bottom-left legend + follow toggle */}
        <div style={{ position: 'absolute', bottom: 22, left: 16, zIndex: 401 }}>
          <div className="rx-card" style={{ padding: '10px 14px', boxShadow: 'var(--shadow)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 11.5, color: 'var(--ink-2)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="rx-bus-pin live" style={{ width: 16, height: 16, borderWidth: 1, borderRadius: '50% 50% 50% 2px' }}/>
                On route
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="rx-bus-pin delayed" style={{ width: 16, height: 16, borderWidth: 1, borderRadius: '50% 50% 50% 2px' }}/>
                Delayed
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span className="rx-bus-pin idle" style={{ width: 16, height: 16, borderWidth: 1, borderRadius: '50% 50% 50% 2px' }}/>
                Idle
              </span>
              <span style={{ width: 1, height: 14, background: 'var(--border)' }} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'default' }}>
                <input type="checkbox" checked={followLive} onChange={e => setFollowLive(e.target.checked)} style={{ accentColor: 'var(--brand)' }}/>
                Follow selected
              </label>
            </div>
          </div>
        </div>

        {/* Selected bus floating card */}
        {selected && (
          <BusDetailCard bus={selected} onClose={() => setSelectedId(null)} onToast={onToast}/>
        )}
      </div>

      {/* Right side panel */}
      <aside style={{
        width: 360, borderLeft: '1px solid var(--border)', background: 'var(--surface)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0,
      }}>
        <div style={{ padding: '16px 18px 8px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Active fleet</h3>
            <span style={{ fontSize: 12, color: 'var(--ink-3)' }}>{visible.length} buses</span>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 10 }}>
          {visible.map(b => {
            const route = ROUTES.find(r => r.id === b.route);
            const active = selectedId === b.id;
            return (
              <button key={b.id} onClick={() => setSelectedId(b.id)} style={{
                width: '100%', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: 12, marginBottom: 6,
                background: active ? 'var(--brand-soft)' : 'transparent',
                border: active ? '1px solid var(--brand-soft)' : '1px solid transparent',
                borderRadius: 'var(--r-sm)', cursor: 'default',
              }} onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface-2)'; }}
                 onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: b.status === 'live' ? 'var(--brand-soft)' : b.status === 'delayed' ? 'var(--warning-soft)' : 'var(--surface-2)',
                  color: b.status === 'live' ? 'var(--brand-ink)' : b.status === 'delayed' ? 'var(--warning)' : 'var(--ink-3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <IcBus size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>Bus {b.label}</span>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: route.color }} />
                    <span style={{ fontSize: 11.5, color: 'var(--ink-3)' }}>{route.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ink-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IcUser size={11.5} style={{ color: 'var(--ink-3)' }} />
                    {b.students}/{b.capacity} · {b.driver}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {b.status === 'live' && <div className="rx-chip live" style={{ height: 20, padding: '0 7px', fontSize: 10.5 }}><span className="dot"/>{b.eta}m</div>}
                  {b.status === 'delayed' && <div className="rx-chip warning" style={{ height: 20, padding: '0 7px', fontSize: 10.5 }}>+{b.lateMin}m</div>}
                  {b.status === 'idle' && <div className="rx-chip" style={{ height: 20, padding: '0 7px', fontSize: 10.5 }}>Idle</div>}
                  <div style={{ fontSize: 10.5, color: 'var(--ink-3)', marginTop: 4 }}>{b.nextStop}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom stats */}
        <div style={{
          padding: 14, borderTop: '1px solid var(--border)',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
          background: 'var(--bg-2)',
        }}>
          <MiniStat label="Onboard"   value={visible.reduce((a,b)=>a+b.students,0)} accent="brand" />
          <MiniStat label="On time"   value={`${Math.round(visible.filter(b=>b.status==='live').length/Math.max(1,visible.length)*100)}%`} accent="success" />
          <MiniStat label="Avg speed" value={`${Math.round(visible.reduce((a,b)=>a+b.speed,0)/Math.max(1,visible.length))} mph`} accent="ink" />
        </div>
      </aside>
    </div>
  );
}

function MiniStat({ label, value, accent }) {
  const colors = {
    brand: 'var(--brand-ink)', success: 'var(--success)', ink: 'var(--ink)',
  };
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div className="rx-display" style={{ fontSize: 22, color: colors[accent] || 'var(--ink)', lineHeight: 1, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function BusDetailCard({ bus, onClose, onToast }) {
  const route = ROUTES.find(r => r.id === bus.route);
  return (
    <div className="rx-card rx-fade-up" style={{
      position: 'absolute', right: 16, bottom: 22, width: 320, zIndex: 401,
      padding: 0, overflow: 'hidden', boxShadow: 'var(--shadow-lg)',
    }}>
      <div style={{
        padding: '14px 16px', background: `linear-gradient(135deg, ${route.color}22, transparent)`,
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, background: 'var(--surface-2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: route.color, border: `1px solid ${route.color}40`,
        }}>
          <IcBus size={22} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="rx-display" style={{ fontSize: 19 }}>Bus {bus.label}</span>
            {bus.status === 'live' && <span className="rx-chip live" style={{ height: 19, padding: '0 7px', fontSize: 10.5 }}><span className="dot"/>Live</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)' }}>{route.name} · {bus.plate}</div>
        </div>
        <button className="rx-btn ghost sm icon" onClick={onClose}><IcClose size={14}/></button>
      </div>

      <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 12, columnGap: 14 }}>
        <DetailKV k="Driver" v={bus.driver} />
        <DetailKV k="Occupancy" v={`${bus.students}/${bus.capacity}`} />
        <DetailKV k="Next stop" v={bus.nextStop} accent="brand" />
        <DetailKV k="ETA" v={`${bus.eta} min`} accent="live" />
        <DetailKV k="Speed" v={`${bus.speed} mph`} />
        <DetailKV k="Battery" v={`${bus.battery}%`} />
      </div>

      {/* Occupancy bar */}
      <div style={{ padding: '0 16px 14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink-3)', marginBottom: 5 }}>
          <span>Capacity</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{Math.round(bus.students/bus.capacity*100)}%</span>
        </div>
        <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden' }}>
          <div style={{ width: `${bus.students/bus.capacity*100}%`, height: '100%', background: 'var(--brand)', borderRadius: 999, transition: 'width .4s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 14px 14px' }}>
        <button className="rx-btn sm" style={{ flex: 1 }} onClick={() => onToast?.('Calling driver…')}><IcPhone size={13}/>Call driver</button>
        <button className="rx-btn sm primary" style={{ flex: 1 }} onClick={() => onToast?.('Message sent to driver')}><IcMsg size={13}/>Message</button>
      </div>
    </div>
  );
}

function DetailKV({ k, v, accent }) {
  const tones = { brand: 'var(--brand-ink)', live: 'var(--live-ink)' };
  return (
    <div>
      <div style={{ fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{k}</div>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: tones[accent] || 'var(--ink)' }}>{v}</div>
    </div>
  );
}

window.TrackingScreen = TrackingScreen;
