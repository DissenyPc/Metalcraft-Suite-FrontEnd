export interface FillingMaterial {
  id?: number;
  reference: string;
  name: string;
  materialType: string;
  thicknessMm?: number;
  unit: string;
  pricePerSquareMeter: number;
  costPrice?: number;
  stockM2: number;
  description?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
