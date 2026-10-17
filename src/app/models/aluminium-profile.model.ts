export interface AluminiumProfile {
  id?: number;
  reference: string;
  name: string;
  series: string;
  finish?: string;
  lengthMeters: number;
  weightPerMeter?: number;
  pricePerMeter: number;
  pricePerBar: number;
  stockBars: number;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
