import { Injectable, inject, signal } from '@angular/core';
import { Subject } from 'rxjs';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { AuthStore } from '../auth/auth-store';
import { LiveBus } from '../../shared/models/tracking.model';
import { Announcement, AppNotification } from '../../shared/models/notification.model';

export type HubStatus = 'disconnected' | 'connecting' | 'connected';

@Injectable({ providedIn: 'root' })
export class TrackingHubClient {
  private readonly auth = inject(AuthStore);
  private connection?: HubConnection;
  private starting?: Promise<void>;

  readonly status = signal<HubStatus>('disconnected');

  readonly busLocationUpdated$ = new Subject<LiveBus>();
  readonly tripStarted$ = new Subject<{ busId: number; routeId: number }>();
  readonly tripEnded$ = new Subject<number>();
  readonly busWentOffline$ = new Subject<number>();
  readonly notificationCreated$ = new Subject<AppNotification>();
  readonly announcementPublished$ = new Subject<Announcement>();

  async connect(): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) return;
    if (this.starting) return this.starting;

    const connection = new HubConnectionBuilder()
      .withUrl('/hubs/tracking', {
        accessTokenFactory: () => this.auth.token() ?? '',
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connection.on('BusLocationUpdated', (loc: LiveBus) => this.busLocationUpdated$.next(loc));
    connection.on('TripStarted', (busId: number, routeId: number) =>
      this.tripStarted$.next({ busId, routeId }),
    );
    connection.on('TripEnded', (busId: number) => this.tripEnded$.next(busId));
    connection.on('BusWentOffline', (busId: number) => this.busWentOffline$.next(busId));
    connection.on('NotificationCreated', (n: AppNotification) => this.notificationCreated$.next(n));
    connection.on('AnnouncementPublished', (a: Announcement) => this.announcementPublished$.next(a));

    connection.onreconnecting(() => this.status.set('connecting'));
    connection.onreconnected(() => this.status.set('connected'));
    connection.onclose(() => this.status.set('disconnected'));

    this.connection = connection;
    this.status.set('connecting');
    this.starting = connection
      .start()
      .then(() => {
        this.status.set('connected');
      })
      .catch((err) => {
        this.status.set('disconnected');
        throw err;
      })
      .finally(() => {
        this.starting = undefined;
      });
    return this.starting;
  }

  async joinRoute(routeId: number): Promise<void> {
    await this.connect();
    await this.connection?.invoke('JoinRoute', routeId);
  }

  async leaveRoute(routeId: number): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('LeaveRoute', routeId);
    }
  }

  async sendLocation(
    tripId: number,
    lat: number,
    lng: number,
    heading: number,
    speed: number,
  ): Promise<void> {
    await this.connect();
    await this.connection?.invoke('SendLocation', tripId, lat, lng, heading, speed);
  }

  async stopBroadcast(tripId: number): Promise<void> {
    if (this.connection?.state === HubConnectionState.Connected) {
      await this.connection.invoke('StopBroadcast', tripId);
    }
  }
}
