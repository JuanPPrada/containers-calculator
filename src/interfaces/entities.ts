export type SqlBool = 0 | 1;

export const toSqlBool = (v: boolean): SqlBool => (v ? 1 : 0);
export const fromSqlBool = (v: SqlBool): boolean => v === 1;

export interface Transformer {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface TransformerPayload {
  name: string;
  length: number;
  width: number;
  height: number;
  weight?: number | null;
  notes?: string | null;
}

export interface Container {
  id: number;
  name: string;
  length: number;
  width: number;
  height: number;
  max_weight: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ContainerPayload {
  name: string;
  length: number;
  width: number;
  height: number;
  max_weight?: number | null;
  notes?: string | null;
}

export interface Order {
  id: number;
  order_number: string | null;
  order_date: string;
  notes: string | null;
  created_at: string;
}

export interface OrderPayload {
  order_number?: string | null;
  order_date: string;
  notes?: string | null;
}

export interface OrderCalculation {
  id: number;
  order_id: number;
  container_id: number | null;
  transformer_id: number | null;
  container_name: string | null;
  container_length: number;
  container_width: number;
  container_height: number;
  container_max_weight: number | null;
  transformer_name: string | null;
  transformer_length: number;
  transformer_width: number;
  transformer_height: number;
  transformer_weight: number | null;
  stacking_enabled: SqlBool;
  orientation: string | null;
  total_fit: number | null;
  notes: string | null;
  created_at: string;
}

export interface OrderCalculationPayload {
  order_id: number;
  container_id?: number | null;
  transformer_id?: number | null;
  container_name?: string | null;
  container_length: number;
  container_width: number;
  container_height: number;
  container_max_weight?: number | null;
  transformer_name?: string | null;
  transformer_length: number;
  transformer_width: number;
  transformer_height: number;
  transformer_weight?: number | null;
  stacking_enabled: boolean;
  orientation?: string | null;
  total_fit?: number | null;
  notes?: string | null;
}
export type OrderCalculationInsert = Omit<OrderCalculation, 'id' | 'created_at'>;

export type OrderCalculationUI = Omit<OrderCalculation, 'stacking_enabled'> & {
  stacking_enabled: boolean;
};
