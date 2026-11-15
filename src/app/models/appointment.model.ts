export type AppointmentStatus = 'pendiente' | 'realizada' | 'pospuesta' | 'atrasada';

export interface AppointmentWorker {
  id: number;
  username: string;
}

export interface Appointment {
  id: number;
  date: string;
  time: string;
  address: string;
  clientName: string;
  clientPhone: string;
  observations: string | null;
  status: AppointmentStatus;
  workers: AppointmentWorker[];
  createdAt: string;
  updatedAt: string | null;
}

export interface AppointmentRequest {
  date: string;
  time: string;
  address: string;
  clientName: string;
  clientPhone: string;
  observations: string;
  status: AppointmentStatus;
  workerIds: number[];
}
