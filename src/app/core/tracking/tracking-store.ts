import { computed, inject } from '@angular/core';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { firstValueFrom } from 'rxjs';
import { TrackingHubClient } from '../realtime/tracking-hub';
import { TrackingApi } from '../api/tracking-api';
import { LiveBus } from '../../shared/models/tracking.model';

interface TrackingState {
  buses: LiveBus[];
  selectedRouteId: number | null;
  loading: boolean;
}

export const TrackingStore = signalStore(
  { providedIn: 'root' },
  withState<TrackingState>({ buses: [], selectedRouteId: null, loading: false }),
  withComputed((store) => ({
    busesForSelectedRoute: computed(() => {
      const id = store.selectedRouteId();
      return id == null ? [] : store.buses().filter((b) => b.routeId === id);
    }),
    activeCount: computed(() => {
      const id = store.selectedRouteId();
      return store.buses().filter((b) => b.routeId === id && !b.isStale).length;
    }),
  })),
  withMethods((store, hub = inject(TrackingHubClient), api = inject(TrackingApi)) => ({
    applyUpdate(bus: LiveBus): void {
      patchState(store, (s) => ({ buses: [...s.buses.filter((b) => b.busId !== bus.busId), bus] }));
    },
    removeBus(busId: number): void {
      patchState(store, (s) => ({ buses: s.buses.filter((b) => b.busId !== busId) }));
    },
    markStale(busId: number): void {
      patchState(store, (s) => ({
        buses: s.buses.map((b) => (b.busId === busId ? { ...b, isStale: true } : b)),
      }));
    },
    async watchRoute(routeId: number): Promise<void> {
      const previous = store.selectedRouteId();
      if (previous != null && previous !== routeId) {
        await hub.leaveRoute(previous);
      }
      patchState(store, { selectedRouteId: routeId, loading: true });
      try {
        const snapshot = await firstValueFrom(api.getActive());
        patchState(store, { buses: snapshot });
      } catch {
        // initial snapshot is best-effort; live updates will populate the map
      }
      patchState(store, { loading: false });
      try {
        await hub.joinRoute(routeId);
      } catch {
        // hub will retry via automatic reconnect
      }
    },
    async stopWatching(): Promise<void> {
      const previous = store.selectedRouteId();
      if (previous != null) {
        await hub.leaveRoute(previous);
      }
      patchState(store, { selectedRouteId: null });
    },
  })),
  withHooks({
    onInit(store) {
      const hub = inject(TrackingHubClient);
      hub.busLocationUpdated$.subscribe((bus) => store.applyUpdate(bus));
      hub.tripEnded$.subscribe((busId) => store.removeBus(busId));
      hub.busWentOffline$.subscribe((busId) => store.markStale(busId));
    },
  }),
);
