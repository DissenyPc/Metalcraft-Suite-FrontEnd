export interface IronProfile {
  id?: number;
  reference: string;
  name: string;
  series: string;
  thicknessMm?: number;
  lengthMeters: number;
  weightPerMeter?: number;
  pricePerKg?: number;
  pricePerMeter: number;
  pricePerBar: number;
  stockBars: number;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
