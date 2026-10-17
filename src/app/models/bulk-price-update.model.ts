export interface BulkPriceUpdateRequest {
  series?: string;
  category?: string;
  materialType?: string;
  percentageAdjustment?: number; // e.g. 5.0 for +5% or -3.5 for -3.5%
  fixedAdjustment?: number;      // e.g. 1.50 for +1.50€
  updateMeterPrice?: boolean;
  updateBarPrice?: boolean;
}

export interface BulkPriceUpdateResult {
  updatedCount: number;
  message: string;
  seriesFilter?: string;
  percentageAdjustment?: number;
  fixedAdjustment?: number;
  timestamp: string;
}

export interface BatchAdjustRequest {
  targetTable: 'ALUMINIUM_PROFILES' | 'IRON_PROFILES' | 'HARDWARE_ACCESSORIES' | 'FILLING_MATERIALS';
  seriesFilter?: string;
  percentage: number;
  priceField?: string;
}

export interface CsvImportResult {
  totalProcessed: number;
  createdCount: number;
  updatedCount: number;
  errorCount: number;
  errors?: string[];
  message: string;
}
