import { Client } from './client.model';

export type BudgetStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'INVOICED' 
  | 'CANCELLED';

export interface BudgetItem {
  id?: number;
  budgetId?: number;
  itemOrder?: number;
  itemCategory?: string; // 'ALUMINIO' | 'HIERRO' | 'HERRAJE' | 'VIDRIO' | 'MANO_DE_OBRA' | 'MONTAJE' | 'OTROS'
  relatedReference?: string;
  concept: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  discountPercentage?: number;
  totalPrice?: number;
  notes?: string;
}

export interface Budget {
  id?: number;
  budgetNumber: string;
  title: string;
  description?: string;
  issueDate: string;
  validUntil?: string;
  status: BudgetStatus;
  client?: Client;
  clientNameSnapshot?: string;
  clientTaxIdSnapshot?: string;
  clientPhoneSnapshot?: string;
  clientEmailSnapshot?: string;
  clientAddressSnapshot?: string;
  items?: BudgetItem[];
  subtotal?: number;
  globalDiscountPercentage?: number;
  globalDiscountAmount?: number;
  taxRate?: number;
  taxAmount?: number;
  total?: number;
  notes?: string;
  termsAndConditions?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DuplicateBudgetRequest {
  newBudgetNumber?: string;
  newTitle?: string;
  targetClientId?: number;
  validityDays?: number;
}
