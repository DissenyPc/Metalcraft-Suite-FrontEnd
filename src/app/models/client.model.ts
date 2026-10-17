export interface Client {
  id?: number;
  name: string;
  companyName?: string;
  taxId?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  province?: string;
  notes?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
