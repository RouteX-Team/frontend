export type BusStatus = 'InService' | 'OffDuty' | 'Maintenance';

export const BUS_STATUSES: BusStatus[] = ['InService', 'OffDuty', 'Maintenance'];

export const BUS_STATUS_LABEL: Record<BusStatus, string> = {
  InService: 'In service',
  OffDuty: 'Off duty',
  Maintenance: 'Maintenance',
};

export interface Bus {
  id: number;
  busNumber: string;
  capacity: number;
  status: BusStatus;
  currentRouteId: number | null;
  currentRouteName: string | null;
  assignedDriverId: number | null;
  assignedDriverName: string | null;
}

export interface BusInput {
  busNumber: string;
  capacity: number;
  status: BusStatus;
  currentRouteId?: number | null;
  assignedDriverId?: number | null;
}
