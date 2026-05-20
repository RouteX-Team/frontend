import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './core/auth.service';
import { ThemeService } from './core/theme.service';

type ScreenId =
  | 'tracking'
  | 'dashboard'
  | 'routes'
  | 'fleet'
  | 'drivers'
  | 'students'
  | 'notifications'
  | 'student-app'
  | 'parent-app'
  | 'driver-app'
  | 'settings';

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
  'student-app': ['Student mobile', 'Preview - iOS'],
  'parent-app': ['Parent portal', 'Preview - iOS'],
  'driver-app': ['Driver mobile', 'Preview - iOS'],
  settings: ['Settings', 'Profile - workspace - integrations'],
};

@Component({
  selector: 'app-workspace',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule],
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
      label: 'Apps preview',
      items: [
        { id: 'student-app', name: 'Student app', icon: 'smartphone' },
        { id: 'parent-app', name: 'Parent portal', icon: 'verified_user' },
        { id: 'driver-app', name: 'Driver app', icon: 'near_me' },
      ],
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
  }

  get title(): string {
    return SCREEN_TITLES[this.current][0];
  }

  get subtitle(): string {
    return SCREEN_TITLES[this.current][1];
  }

  get selectedBus(): RouteXBus {
    return this.buses.find((bus) => bus.id === 'B-309') ?? this.buses[0];
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

  navigate(id: NavItem['id']): void {
    if (id === 'login') {
      void this.router.navigate(['/login']);
      return;
    }

    void this.router.navigate(['/', id]);
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
    this.toast = message;
    window.setTimeout(() => {
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
}
