export type UserRole = 'DIRECTIVO' | 'EJECUTIVO' | 'OPERATIVO' | 'ADMINISTRATIVO';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface BirdMovementPayload {
  initial_birds: number;
  mortality: number;
  entries: number;
}

export interface EggProductionPayload {
  jumbo: number;
  large: number;
  medium: number;
  small: number;
  broken: number;
}

export interface FeedConsumptionPayload {
  feed_inventory_id: number;
  quantity_sacks_consumed: number;
}

export interface DispatchPayload {
  boxes_shipped: number;
  live_birds_shipped: number;
  manure_sacks: number;
  invoice_number: string;
}

export interface HealthPayload {
  vaccines_applied?: string;
  infrastructure_notes?: string;
}

export interface DailyReportPayload {
  flock_id: number;
  report_date: string;
  bird_movement: BirdMovementPayload;
  egg_production: EggProductionPayload;
  feed_consumptions: FeedConsumptionPayload[];
  dispatch: DispatchPayload;
  health: HealthPayload;
}
