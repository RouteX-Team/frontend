import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, RouteXRole } from './core/auth.service';

type AppRole = Exclude<RouteXRole, 'admin'>;
type RoleTab = 'home' | 'pass' | 'routes' | 'family' | 'inbox' | 'trips' | 'checklist' | 'manifest';

interface AppTab {
  id: RoleTab;
  label: string;
  icon: string;
}

interface Stop {
  name: string;
  eta: string;
  riders: number;
  status: 'done' | 'current' | 'next';
}

interface Message {
  from: string;
  body: string;
  time: string;
  unread: boolean;
}

const ROLE_TABS: Record<AppRole, AppTab[]> = {
  student: [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'pass', label: 'Pass', icon: 'qr_code_2' },
    { id: 'routes', label: 'Routes', icon: 'route' },
  ],
  parent: [
    { id: 'family', label: 'Family', icon: 'shield' },
    { id: 'inbox', label: 'Inbox', icon: 'chat' },
    { id: 'trips', label: 'Trips', icon: 'history' },
  ],
  driver: [
    { id: 'checklist', label: 'Checks', icon: 'fact_check' },
    { id: 'manifest', label: 'Manifest', icon: 'groups' },
    { id: 'routes', label: 'Route', icon: 'near_me' },
  ],
};

const DEFAULT_TAB: Record<AppRole, RoleTab> = {
  student: 'home',
  parent: 'family',
  driver: 'checklist',
};

@Component({
  selector: 'app-role-app',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './role-app.component.html',
  styleUrl: './role-app.component.scss',
})
export class RoleAppComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly auth = inject(AuthService);

  readonly role = this.route.snapshot.data['role'] as AppRole;
  readonly activeTab = signal<RoleTab>(DEFAULT_TAB[this.role]);
  readonly checkedIn = signal(false);
  readonly pickupAlerts = signal(true);
  readonly selectedRoute = signal('R1');
  readonly selectedChild = signal('Amelia Tran');
  readonly tripStarted = signal(false);
  readonly currentStopIndex = signal(0);
  readonly checklist = signal<Record<string, boolean>>({
    inspection: true,
    manifest: true,
    radio: false,
    firstAid: false,
  });
  readonly messages = signal<Message[]>([
    {
      from: 'Dispatch',
      body: 'B-204 is approaching Library. Please keep Amelia near the stop.',
      time: '2 min',
      unread: true,
    },
    {
      from: 'Maya Okafor',
      body: 'Traffic is clear after Science Hill.',
      time: '11 min',
      unread: true,
    },
    {
      from: 'Transport Services',
      body: 'Tomorrow route R1 starts five minutes earlier.',
      time: '1 h',
      unread: false,
    },
  ]);

  readonly heatmap = [38, 54, 22, 66, 71, 45, 84, 61, 35, 48, 92, 57, 41, 79, 63, 29];
  readonly routes = [
    { id: 'R1', name: 'Main Loop', bus: 'B-204', eta: '3 min', status: 'On time', color: '#1f7a5b' },
    { id: 'R2', name: 'North Express', bus: 'B-117', eta: '8 min', status: 'Boarding', color: '#b8612d' },
    { id: 'R3', name: 'West Shuttle', bus: 'B-309', eta: '11 min', status: 'Delayed', color: '#7a4f8e' },
  ];
  readonly stops: Stop[] = [
    { name: 'Library', eta: 'Now', riders: 12, status: 'current' },
    { name: 'Science Hill', eta: '7 min', riders: 9, status: 'next' },
    { name: 'Stadium', eta: '14 min', riders: 7, status: 'next' },
    { name: 'East Gate', eta: '22 min', riders: 4, status: 'next' },
  ];
  readonly riders = [
    { name: 'Amelia Tran', stop: 'Library', status: 'Checked in' },
    { name: 'Sienna Bell', stop: 'Science Hill', status: 'Waiting' },
    { name: 'Priya Ananth', stop: 'Stadium', status: 'Waiting' },
    { name: 'Olufemi Adeyemi', stop: 'East Gate', status: 'Waiting' },
  ];
  readonly tripHistory = [
    { day: 'Today', route: 'Main Loop', result: 'Onboard', time: '8:11 AM' },
    { day: 'Yesterday', route: 'Main Loop', result: 'Dropped', time: '4:36 PM' },
    { day: 'Monday', route: 'North Express', result: 'On time', time: '8:04 AM' },
  ];

  readonly tabs = computed(() => ROLE_TABS[this.role]);
  readonly activeRoute = computed(() => this.routes.find((route) => route.id === this.selectedRoute()) ?? this.routes[0]);
  readonly unreadCount = computed(() => this.messages().filter((message) => message.unread).length);
  readonly completedChecks = computed(() => Object.values(this.checklist()).filter(Boolean).length);
  readonly canStartTrip = computed(() => Object.values(this.checklist()).every(Boolean));
  readonly currentStop = computed(() => this.stops[Math.min(this.currentStopIndex(), this.stops.length - 1)]);
  readonly heroTitle = computed(() => {
    if (this.role === 'student') {
      return this.checkedIn() ? 'You are checked in for Main Loop.' : 'Your Main Loop bus is 3 minutes away.';
    }

    if (this.role === 'parent') {
      return this.pickupAlerts() ? `${this.selectedChild()} is safely onboard.` : 'Family trip monitoring is active.';
    }

    return this.tripStarted() ? `Next stop: ${this.currentStop().name}` : 'R1 Main Loop is ready to depart.';
  });

  get userName(): string {
    return this.auth.user()?.name ?? this.defaultName;
  }

  get defaultName(): string {
    return this.role === 'student' ? 'Amelia Tran' : this.role === 'parent' ? 'Hung Tran' : 'Maya Okafor';
  }

  get roleLabel(): string {
    return this.role === 'student' ? 'Student app' : this.role === 'parent' ? 'Parent portal' : 'Driver app';
  }

  get initials(): string {
    return this.initialsOf(this.userName);
  }

  initialsOf(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  selectTab(tab: RoleTab): void {
    this.activeTab.set(tab);
  }

  toggleCheckIn(): void {
    this.checkedIn.update((value) => !value);
  }

  togglePickupAlerts(): void {
    this.pickupAlerts.update((value) => !value);
  }

  selectRoute(routeId: string): void {
    this.selectedRoute.set(routeId);
  }

  selectChild(name: string): void {
    this.selectedChild.set(name);
  }

  markMessageRead(index: number): void {
    this.messages.update((messages) =>
      messages.map((message, messageIndex) =>
        messageIndex === index ? { ...message, unread: false } : message,
      ),
    );
  }

  toggleChecklist(key: string): void {
    this.checklist.update((checks) => ({ ...checks, [key]: !checks[key] }));
  }

  startTrip(): void {
    if (this.canStartTrip()) {
      this.tripStarted.set(true);
      this.activeTab.set('routes');
    }
  }

  completeStop(): void {
    this.tripStarted.set(true);
    this.currentStopIndex.update((index) => Math.min(index + 1, this.stops.length - 1));
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
