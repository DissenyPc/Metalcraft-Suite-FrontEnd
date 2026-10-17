export interface HardwareAccessory {
  id?: number;
  reference: string;
  name: string;
  category: string;
  brand?: string;
  supplier?: string;
  unit: string;
  costPrice?: number;
  salePrice: number;
  stockQuantity: number;
  minStockAlert: number;
  notes?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
