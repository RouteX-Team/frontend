import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './core/auth.service';
import { ThemeService } from './core/theme.service';
import { AdminSidebarComponent } from './layout/admin-sidebar.component';
import { AdminTopbarComponent } from './layout/admin-topbar.component';

type ScreenId =
  | 'tracking'
  | 'dashboard'
  | 'routes'
  | 'fleet'
  | 'drivers'
  | 'students'
  | 'notifications'
  | 'settings';

type BusStatusFilter = 'all' | 'live' | 'delayed' | 'idle';

interface NavItem {
  id: ScreenId | 'login';
  name: string;
  icon: string;
  count?: number;
  badge?: string;
}

interface RouteXRoute {
  id: string;
  name: string;
  color: string;
  tone: string;
  stops: string[];
  trips: number;
  riders: number;
  onTime: number;
}

interface RouteXBus {
  id: string;
  label: string;
  plate: string;
  route: string;
  driver: string;
  status: 'live' | 'delayed' | 'idle';
  students: number;
  capacity: number;
  speed: number;
  nextStop: string;
  eta: number;
  battery: number;
  left: number;
  top: number;
}

const SCREEN_TITLES: Record<ScreenId, [string, string]> = {
  tracking: ['Live tracking', 'Real-time positions of all active buses - updates every 3s'],
  dashboard: ['Operations', 'Today - live campus transport overview'],
  routes: ['Routes', '4 active routes - 87 stops - 23 trips today'],
  fleet: ['Fleet', '6 buses - 5 in service - 1 idle'],
  drivers: ['Drivers', '8 drivers - 6 on shift'],
  students: ['Students', '4,912 enrolled - 198 onboard now'],
  notifications: ['Notifications', '3 unread - 7 today'],
  settings: ['Settings', 'Profile - workspace - integrations'],
};

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    AdminSidebarComponent,
    AdminTopbarComponent,
  ],
  templateUrl: './workspace.component.html',
  styleUrl: './workspace.component.css',
})
export class WorkspaceComponent implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly theme = inject(ThemeService);
  private readonly sub: Subscription;

  current: ScreenId = 'tracking';
  toast = '';
  private toastTimer?: ReturnType<typeof setTimeout>;
  readonly searchTerm = signal('');
  readonly routeFilter = signal('all');
  readonly statusFilter = signal<BusStatusFilter>('all');
  readonly unreadOnly = signal(false);
  readonly selectedBusId = signal('B-309');
  readonly organization = signal('Aldridge University');
  readonly workspaceName = signal('Transport Services');
  readonly defaultCampus = signal('Main Quad');

  // Form state
  formOpen = false;
  formMode: 'create' | 'edit' = 'create';
  formEntity: ScreenId | null = null;
  editingId: string | null = null;

  routeForm = { name: '', color: '#3277b8', stops: [] as string[], stopInput: '' };
  busForm: { plate: string; routeId: string; driverName: string; status: string; capacity: number } = {
    plate: '',
    routeId: 'R1',
    driverName: 'Unassigned',
    status: 'idle',
    capacity: 42,
  };
  driverForm = { name: '', route: '-', shift: 'AM', status: 'standby' };
  studentForm = { name: '', grade: 'Freshman', route: 'R1', stop: '', guardian: '', status: 'waiting' };

  readonly navSections: { label: string; items: NavItem[] }[] = [
    {
      label: 'Operations',
      items: [
        { id: 'tracking', name: 'Live tracking', icon: 'map', badge: 'live' },
        { id: 'dashboard', name: 'Dashboard', icon: 'dashboard' },
        { id: 'routes', name: 'Routes', icon: 'alt_route' },
        { id: 'fleet', name: 'Fleet', icon: 'directions_bus', count: 6 },
      ],
    },
    {
      label: 'People',
      items: [
        { id: 'drivers', name: 'Drivers', icon: 'person', count: 8 },
        { id: 'students', name: 'Students', icon: 'groups', count: 4912 },
      ],
    },
    {
      label: 'Communicate',
      items: [{ id: 'notifications', name: 'Notifications', icon: 'notifications', count: 3 }],
    },
    {
      label: 'Account',
      items: [
        { id: 'settings', name: 'Settings', icon: 'settings' },
        { id: 'login', name: 'Sign-in screen', icon: 'lock' },
      ],
    },
  ];

  readonly routes: RouteXRoute[] = [
    {
      id: 'R1',
      name: 'Main Loop',
      color: '#1f7a5b',
      tone: 'brand',
      stops: ['Quad', 'Library', 'Science Hill', 'Stadium', 'East Gate'],
      trips: 8,
      riders: 712,
      onTime: 96,
    },
    {
      id: 'R2',
      name: 'North Express',
      color: '#b8612d',
      tone: 'live',
      stops: ['Quad', 'Memorial Auditorium', 'North Dorms', 'Athletic Center'],
      trips: 6,
      riders: 558,
      onTime: 94,
    },
    {
      id: 'R3',
      name: 'West Shuttle',
      color: '#7a4f8e',
      tone: 'plum',
      stops: ['Quad', 'Engineering', 'West Village', 'Medical Center'],
      trips: 5,
      riders: 431,
      onTime: 88,
    },
    {
      id: 'R4',
      name: 'South Lakeside',
      color: '#a17712',
      tone: 'amber',
      stops: ['Quad', 'Business School', 'Lake Path', 'South Lot'],
      trips: 4,
      riders: 326,
      onTime: 97,
    },
  ];

  readonly buses: RouteXBus[] = [
    {
      id: 'B-204',
      label: '204',
      plate: 'RTX-204',
      route: 'R1',
      driver: 'Maya Okafor',
      status: 'live',
      students: 28,
      capacity: 42,
      speed: 24,
      nextStop: 'Library',
      eta: 3,
      battery: 86,
      left: 39,
      top: 43,
    },
    {
      id: 'B-117',
      label: '117',
      plate: 'RTX-117',
      route: 'R2',
      driver: 'Theo Ramirez',
      status: 'live',
      students: 19,
      capacity: 36,
      speed: 18,
      nextStop: 'North Dorms',
      eta: 6,
      battery: 71,
      left: 62,
      top: 29,
    },
    {
      id: 'B-309',
      label: '309',
      plate: 'RTX-309',
      route: 'R3',
      driver: 'Priya Shah',
      status: 'delayed',
      students: 33,
      capacity: 42,
      speed: 12,
      nextStop: 'West Village',
      eta: 11,
      battery: 58,
      left: 24,
      top: 58,
    },
    {
      id: 'B-451',
      label: '451',
      plate: 'RTX-451',
      route: 'R4',
      driver: 'Adaora Nwosu',
      status: 'live',
      students: 14,
      capacity: 36,
      speed: 22,
      nextStop: 'Business School',
      eta: 2,
      battery: 93,
      left: 52,
      top: 66,
    },
    {
      id: 'B-128',
      label: '128',
      plate: 'RTX-128',
      route: 'R1',
      driver: 'Lucas Pereira',
      status: 'idle',
      students: 0,
      capacity: 42,
      speed: 0,
      nextStop: 'Depot',
      eta: 0,
      battery: 100,
      left: 16,
      top: 30,
    },
    {
      id: 'B-377',
      label: '377',
      plate: 'RTX-377',
      route: 'R2',
      driver: 'Jin Park',
      status: 'live',
      students: 22,
      capacity: 36,
      speed: 27,
      nextStop: 'Athletic Center',
      eta: 4,
      battery: 64,
      left: 75,
      top: 50,
    },
  ];

  readonly drivers = [
    { id: 'D01', name: 'Maya Okafor', route: 'R1', trips: 412, rating: 4.9, status: 'active', shift: 'AM' },
    { id: 'D02', name: 'Theo Ramirez', route: 'R2', trips: 289, rating: 4.8, status: 'active', shift: 'AM' },
    { id: 'D03', name: 'Priya Shah', route: 'R3', trips: 631, rating: 4.7, status: 'active', shift: 'PM' },
    { id: 'D04', name: 'Adaora Nwosu', route: 'R4', trips: 178, rating: 5, status: 'active', shift: 'AM' },
    { id: 'D05', name: 'Lucas Pereira', route: 'R1', trips: 502, rating: 4.6, status: 'standby', shift: 'PM' },
    { id: 'D06', name: 'Jin Park', route: 'R2', trips: 367, rating: 4.9, status: 'active', shift: 'PM' },
    { id: 'D07', name: 'Noor Haddad', route: '-', trips: 245, rating: 4.8, status: 'off', shift: '-' },
    { id: 'D08', name: 'Ines Carvalho', route: '-', trips: 198, rating: 4.7, status: 'off', shift: '-' },
  ];

  readonly students = [
    { id: 'S001', name: 'Amelia Tran', grade: 'Sophomore', route: 'R1', stop: 'Library', guardian: 'Hung Tran', status: 'onboard' },
    { id: 'S002', name: 'Carlos Mendes', grade: 'Freshman', route: 'R2', stop: 'North Dorms', guardian: 'Rita Mendes', status: 'waiting' },
    { id: 'S003', name: 'Sienna Bell', grade: 'Junior', route: 'R3', stop: 'West Village', guardian: 'Joel Bell', status: 'onboard' },
    { id: 'S004', name: 'Dmitri Volkov', grade: 'Senior', route: 'R1', stop: 'Stadium', guardian: 'Anya Volkov', status: 'dropped' },
    { id: 'S005', name: 'Priya Ananth', grade: 'Freshman', route: 'R4', stop: 'Business School', guardian: 'Sundar Ananth', status: 'onboard' },
    { id: 'S006', name: 'Eli Brennan', grade: 'Sophomore', route: 'R2', stop: 'Athletic Center', guardian: 'Mara Brennan', status: 'absent' },
    { id: 'S007', name: 'Yuki Tanaka', grade: 'Junior', route: 'R3', stop: 'Medical Center', guardian: 'Hiro Tanaka', status: 'onboard' },
    { id: 'S008', name: 'Olufemi Adeyemi', grade: 'Senior', route: 'R1', stop: 'East Gate', guardian: 'Funmi Adeyemi', status: 'waiting' },
  ];

  readonly notifications = [
    { title: 'B-309 delayed 7 min', meta: 'West Shuttle - West Village', time: '2 min ago', tone: 'warning', unread: true },
    { title: 'B-204 arriving at Library', meta: 'Main Loop - 3 min ETA', time: '4 min ago', tone: 'info', unread: true },
    { title: '198 students checked in today', meta: 'Attendance - 87% on time', time: '12 min ago', tone: 'success', unread: true },
    { title: 'Driver pressed SOS on B-309', meta: 'Cleared by dispatch - Priya Shah', time: '38 min ago', tone: 'danger', unread: false },
    { title: 'Route R2 schedule updated', meta: 'Effective tomorrow 7:00 AM', time: '1 h ago', tone: 'brand', unread: false },
    { title: 'B-128 due for inspection', meta: 'Maintenance - 800 mi remaining', time: '3 h ago', tone: 'amber', unread: false },
    { title: 'B-451 reached South Lot', meta: 'South Lakeside - on time', time: '4 h ago', tone: 'success', unread: false },
  ];

  readonly chart = [42, 58, 74, 63, 88, 96, 72, 66, 84, 91, 78, 68];
  readonly heatmap = [38, 54, 22, 66, 71, 45, 84, 61, 35, 48, 92, 57, 41, 79, 63, 29];

  constructor() {
    this.sub = this.route.paramMap.subscribe((params) => {
      const requested = params.get('screen') as ScreenId | null;
      this.current = this.isScreen(requested) ? requested : 'tracking';
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }
  }

  get title(): string {
    return SCREEN_TITLES[this.current][0];
  }

  get subtitle(): string {
    return SCREEN_TITLES[this.current][1];
  }

  get selectedBus(): RouteXBus {
    return this.buses.find((bus) => bus.id === this.selectedBusId()) ?? this.buses[0];
  }

  get activeBuses(): number {
    return this.buses.filter((bus) => bus.status !== 'idle').length;
  }

  get onboardCount(): number {
    return this.buses.reduce((total, bus) => total + bus.students, 0);
  }

  get avgOccupancy(): number {
    const capacity = this.buses.reduce((total, bus) => total + bus.capacity, 0);
    return Math.round((this.onboardCount / capacity) * 100);
  }

  get userName(): string {
    return this.auth.user()?.name ?? 'Elena Marquez';
  }

  get userInitials(): string {
    return this.initials(this.userName);
  }

  get filteredRoutes(): RouteXRoute[] {
    const routeFilter = this.routeFilter();
    const query = this.normalizedSearch();

    return this.routes.filter((route) => {
      const matchesRoute = routeFilter === 'all' || route.id === routeFilter;
      const matchesQuery = this.matchesSearch(query, [route.id, route.name, ...route.stops]);
      return matchesRoute && matchesQuery;
    });
  }

  get filteredBuses(): RouteXBus[] {
    const routeFilter = this.routeFilter();
    const statusFilter = this.statusFilter();
    const query = this.normalizedSearch();

    return this.buses.filter((bus) => {
      const matchesRoute = routeFilter === 'all' || bus.route === routeFilter;
      const matchesStatus = statusFilter === 'all' || bus.status === statusFilter;
      const route = this.routeFor(bus.route);
      const matchesQuery = this.matchesSearch(query, [
        bus.id,
        bus.label,
        bus.plate,
        bus.driver,
        bus.nextStop,
        route.name,
      ]);
      return matchesRoute && matchesStatus && matchesQuery;
    });
  }

  get filteredDrivers(): typeof this.drivers {
    const query = this.normalizedSearch();
    return this.drivers.filter((driver) =>
      this.matchesSearch(query, [
        driver.id,
        driver.name,
        driver.route,
        driver.status,
        driver.shift,
      ]),
    );
  }

  get filteredStudents(): typeof this.students {
    const query = this.normalizedSearch();
    return this.students.filter((student) =>
      this.matchesSearch(query, [
        student.id,
        student.name,
        student.grade,
        student.route,
        student.stop,
        student.guardian,
        student.status,
      ]),
    );
  }

  get filteredNotifications(): typeof this.notifications {
    const query = this.normalizedSearch();
    const unreadOnly = this.unreadOnly();
    return this.notifications.filter((note) => {
      const matchesUnread = !unreadOnly || note.unread;
      const matchesQuery = this.matchesSearch(query, [note.title, note.meta, note.time, note.tone]);
      return matchesUnread && matchesQuery;
    });
  }

  get filterLabel(): string {
    const status = this.statusFilter();
    return status === 'all' ? 'all buses' : `${status} buses`;
  }

  navigate(id: string): void {
    if (id === 'login') {
      void this.router.navigate(['/login']);
      return;
    }

    if (!this.isScreen(id)) {
      void this.router.navigate(['/admin', 'tracking']);
      return;
    }

    void this.router.navigate(['/admin', id]);
  }

  setSearch(term: string): void {
    this.searchTerm.set(term);
  }

  selectRouteFilter(id: string): void {
    this.routeFilter.set(this.routeFilter() === id ? 'all' : id);
    this.showToast(this.routeFilter() === 'all' ? 'Showing all routes' : `Filtered to ${id}`);
  }

  selectBus(id: string): void {
    this.selectedBusId.set(id);
    this.showToast(`${id} selected`);
  }

  recenterMap(): void {
    this.routeFilter.set('all');
    this.statusFilter.set('all');
    this.selectedBusId.set('B-309');
    this.showToast('Map recentered on active fleet');
  }

  cycleFilter(): void {
    if (this.current === 'notifications') {
      this.unreadOnly.update((value) => !value);
      this.showToast(this.unreadOnly() ? 'Showing unread notifications' : 'Showing all notifications');
      return;
    }

    const order: BusStatusFilter[] = ['all', 'live', 'delayed', 'idle'];
    const next = order[(order.indexOf(this.statusFilter()) + 1) % order.length];
    this.statusFilter.set(next);
    this.showToast(`Filter applied: ${this.filterLabel}`);
  }

  exportView(): void {
    const counts: Record<ScreenId, number> = {
      tracking: this.filteredBuses.length,
      dashboard: this.routes.length,
      routes: this.filteredRoutes.length,
      fleet: this.filteredBuses.length,
      drivers: this.filteredDrivers.length,
      students: this.filteredStudents.length,
      notifications: this.filteredNotifications.length,
      settings: 1,
    };
    this.showToast(`Export ready: ${counts[this.current]} ${this.current} records`);
  }

  jumpToToday(): void {
    this.searchTerm.set('');
    this.routeFilter.set('all');
    this.statusFilter.set('all');
    this.unreadOnly.set(false);
    this.showToast('Dashboard reset to today');
  }

  createRecord(): void {
    if (
      this.current === 'routes' ||
      this.current === 'fleet' ||
      this.current === 'drivers' ||
      this.current === 'students'
    ) {
      this.openForm(this.current);
      return;
    }
    this.showToast('New item action is not available on this screen');
  }

  openForm(entity: ScreenId, item?: Record<string, unknown>): void {
    this.formEntity = entity;
    if (item) {
      this.formMode = 'edit';
      this.editingId = item['id'] as string;
      if (entity === 'routes') {
        this.routeForm = {
          name: item['name'] as string,
          color: item['color'] as string,
          stops: [...(item['stops'] as string[])],
          stopInput: '',
        };
      } else if (entity === 'fleet') {
        this.busForm = {
          plate: item['plate'] as string,
          routeId: item['route'] as string,
          driverName: item['driver'] as string,
          status: item['status'] as string,
          capacity: item['capacity'] as number,
        };
      } else if (entity === 'drivers') {
        this.driverForm = {
          name: item['name'] as string,
          route: item['route'] as string,
          shift: item['shift'] as string,
          status: item['status'] as string,
        };
      } else if (entity === 'students') {
        this.studentForm = {
          name: item['name'] as string,
          grade: item['grade'] as string,
          route: item['route'] as string,
          stop: item['stop'] as string,
          guardian: item['guardian'] as string,
          status: item['status'] as string,
        };
      }
    } else {
      this.formMode = 'create';
      this.editingId = null;
      if (entity === 'routes') {
        this.routeForm = { name: '', color: '#3277b8', stops: [], stopInput: '' };
      } else if (entity === 'fleet') {
        this.busForm = { plate: '', routeId: 'R1', driverName: 'Unassigned', status: 'idle', capacity: 42 };
      } else if (entity === 'drivers') {
        this.driverForm = { name: '', route: '-', shift: 'AM', status: 'standby' };
      } else if (entity === 'students') {
        this.studentForm = { name: '', grade: 'Freshman', route: 'R1', stop: '', guardian: '', status: 'waiting' };
      }
    }
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
  }

  addStop(): void {
    const stop = this.routeForm.stopInput.trim();
    if (stop && !this.routeForm.stops.includes(stop)) {
      this.routeForm.stops = [...this.routeForm.stops, stop];
    }
    this.routeForm.stopInput = '';
  }

  removeStop(index: number): void {
    this.routeForm.stops = this.routeForm.stops.filter((_, i) => i !== index);
  }

  submitForm(): void {
    const entity = this.formEntity;
    const mode = this.formMode;
    if (!entity) return;

    if (entity === 'routes') {
      if (mode === 'create') {
        const id = `R${this.routes.length + 1}`;
        this.routes.push({
          id,
          name: this.routeForm.name || 'New Route',
          color: this.routeForm.color,
          tone: 'brand',
          stops: [...this.routeForm.stops],
          trips: 0,
          riders: 0,
          onTime: 100,
        });
        this.showToast(`${id} route created`);
      } else {
        const idx = this.routes.findIndex((r) => r.id === this.editingId);
        if (idx !== -1) {
          this.routes[idx] = {
            ...this.routes[idx],
            name: this.routeForm.name,
            color: this.routeForm.color,
            stops: [...this.routeForm.stops],
          };
          this.showToast(`${this.editingId} updated`);
        }
      }
    } else if (entity === 'fleet') {
      if (mode === 'create') {
        const label = String(500 + this.buses.length);
        this.buses.push({
          id: `B-${label}`,
          label,
          plate: this.busForm.plate || `RTX-${label}`,
          route: this.busForm.routeId,
          driver: this.busForm.driverName,
          status: this.busForm.status as RouteXBus['status'],
          students: 0,
          capacity: this.busForm.capacity,
          speed: 0,
          nextStop: 'Depot',
          eta: 0,
          battery: 100,
          left: 12,
          top: 72,
        });
        this.showToast(`Bus B-${label} added`);
      } else {
        const idx = this.buses.findIndex((b) => b.id === this.editingId);
        if (idx !== -1) {
          this.buses[idx] = {
            ...this.buses[idx],
            plate: this.busForm.plate,
            route: this.busForm.routeId,
            driver: this.busForm.driverName,
            status: this.busForm.status as RouteXBus['status'],
            capacity: this.busForm.capacity,
          };
          this.showToast(`${this.editingId} updated`);
        }
      }
    } else if (entity === 'drivers') {
      if (mode === 'create') {
        const id = `D${String(this.drivers.length + 1).padStart(2, '0')}`;
        this.drivers.push({
          id,
          name: this.driverForm.name || 'New Driver',
          route: this.driverForm.route,
          trips: 0,
          rating: 5,
          status: this.driverForm.status,
          shift: this.driverForm.shift,
        });
        this.showToast(`${id} driver created`);
      } else {
        const idx = this.drivers.findIndex((d) => d.id === this.editingId);
        if (idx !== -1) {
          this.drivers[idx] = {
            ...this.drivers[idx],
            name: this.driverForm.name,
            route: this.driverForm.route,
            status: this.driverForm.status,
            shift: this.driverForm.shift,
          };
          this.showToast(`${this.editingId} updated`);
        }
      }
    } else if (entity === 'students') {
      if (mode === 'create') {
        const id = `S${String(this.students.length + 1).padStart(3, '0')}`;
        this.students.push({
          id,
          name: this.studentForm.name || 'New Student',
          grade: this.studentForm.grade,
          route: this.studentForm.route,
          stop: this.studentForm.stop,
          guardian: this.studentForm.guardian,
          status: this.studentForm.status,
        });
        this.showToast(`${id} student created`);
      } else {
        const idx = this.students.findIndex((s) => s.id === this.editingId);
        if (idx !== -1) {
          this.students[idx] = {
            ...this.students[idx],
            name: this.studentForm.name,
            grade: this.studentForm.grade,
            route: this.studentForm.route,
            stop: this.studentForm.stop,
            guardian: this.studentForm.guardian,
            status: this.studentForm.status,
          };
          this.showToast(`${this.editingId} updated`);
        }
      }
    }

    this.closeForm();
  }

  deleteRecord(entity: ScreenId, id: string): void {
    if (entity === 'routes') {
      const idx = this.routes.findIndex((r) => r.id === id);
      if (idx !== -1) this.routes.splice(idx, 1);
    } else if (entity === 'fleet') {
      const idx = this.buses.findIndex((b) => b.id === id);
      if (idx !== -1) this.buses.splice(idx, 1);
    } else if (entity === 'drivers') {
      const idx = this.drivers.findIndex((d) => d.id === id);
      if (idx !== -1) this.drivers.splice(idx, 1);
    } else if (entity === 'students') {
      const idx = this.students.findIndex((s) => s.id === id);
      if (idx !== -1) this.students.splice(idx, 1);
    }
    this.showToast(`${id} deleted`);
  }

  markNotificationRead(note: { unread: boolean; title: string }): void {
    note.unread = false;
    this.showToast(`Marked read: ${note.title}`);
  }

  notifyRiders(): void {
    this.notifications.unshift({
      title: 'Riders notified about B-309 delay',
      meta: 'West Shuttle - parent and student apps',
      time: 'Just now',
      tone: 'info',
      unread: false,
    });
    this.showToast('Riders notified');
  }

  callDriver(): void {
    this.showToast(`Calling ${this.selectedBus.driver}`);
  }

  updateOrganization(event: Event): void {
    this.organization.set((event.target as HTMLInputElement).value);
  }

  updateWorkspace(event: Event): void {
    this.workspaceName.set((event.target as HTMLInputElement).value);
  }

  updateCampus(event: Event): void {
    this.defaultCampus.set((event.target as HTMLInputElement).value);
  }

  saveSettings(): void {
    this.showToast('Workspace settings saved');
  }

  routeFor(id: string): RouteXRoute {
    return this.routes.find((route) => route.id === id) ?? this.routes[0];
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  showToast(message: string): void {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer);
    }

    this.toast = message;
    this.toastTimer = setTimeout(() => {
      this.toast = '';
    }, 2200);
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }

  private isScreen(value: string | null): value is ScreenId {
    return !!value && Object.prototype.hasOwnProperty.call(SCREEN_TITLES, value);
  }

  private normalizedSearch(): string {
    return this.searchTerm().trim().toLowerCase();
  }

  private matchesSearch(query: string, values: Array<string | number>): boolean {
    if (!query) {
      return true;
    }

    return values.some((value) => String(value).toLowerCase().includes(query));
  }
}
