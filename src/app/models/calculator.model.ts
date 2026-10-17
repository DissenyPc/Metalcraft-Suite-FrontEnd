export interface ProfileCutItem {
  pieceDescription: string;
  lengthMm: number;
  quantity: number;
  mitreAngle?: string; // e.g. "45° / 45°", "90° / 90°"
}

export interface GlassPaneItem {
  paneDescription: string;
  widthMm: number;
  heightMm: number;
  areaSquareMeters: number;
  quantity: number;
}

// 1. Structure Calculation
export interface StructureCalculationRequest {
  openingWidthMm: number;
  openingHeightMm: number;
  solapePerSideMm?: number;
  profileMaterial?: 'ALUMINIUM' | 'IRON';
  profileId?: number;
  profileSeries?: string;
  commercialBarLengthMm?: number;
}

export interface StructureCalculationResult {
  openingWidthMm: number;
  openingHeightMm: number;
  solapePerSideMm: number;
  totalSolapeWidthDeductionMm: number;
  totalSolapeHeightDeductionMm: number;
  fabricationWidthMm: number;
  fabricationHeightMm: number;
  cuts: ProfileCutItem[];
  totalProfileLengthMm: number;
  totalProfileLengthMeters: number;
  selectedCommercialBarLengthMm: number;
  commercialBarsNeeded: number;
  totalCommercialStockLengthMm: number;
  wasteMeters: number;
  wastePercentage: number;
  profileInfo?: string;
  estimatedCost?: number;
  notes?: string;
}

// 2. Built-in Shutter (Persiana Compacto)
export interface ShutterCalculationRequest {
  openingWidthMm: number;
  openingHeightMm: number;
  boxHeightMm?: number; // e.g. 155, 185, 200
  winderType?: 'BUILT_IN' | 'EXTERNAL_STRAP' | 'MOTORIZED' | 'CRANK';
  builtInWinderDeductionMm?: number; // default 30mm
  guideDeductionMm?: number;
}

export interface ShutterCalculationResult {
  openingWidthMm: number;
  openingHeightMm: number;
  boxHeightMm: number;
  winderType: string;
  totalWidthDeductionMm: number;
  usableWindowHeightMm: number;
  shutterSlatWidthMm: number;
  shutterSlatHeightMm: number;
  shutterAreaSquareMeters: number;
  guideHeightMm: number;
  guideQuantity: number;
  estimatedSlatsCount: number;
  notes: string;
}

// 3. Fixed Modules (Módulos Fijos)
export interface FixedModuleCalculationRequest {
  totalWidthMm: number;
  totalHeightMm: number;
  isPerimeterSeries?: boolean; // true = shared frame with T transoms, false = independent frames with H coupler
  horizontalDivisions?: number;
  verticalDivisions?: number;
  profileSeries?: string;
  tProfileDeductionMm?: number;
  hProfileDeductionMm?: number;
}

export interface FixedModuleCalculationResult {
  totalWidthMm: number;
  totalHeightMm: number;
  isPerimeterSeries: boolean;
  totalPanesCount: number;
  outerFrameCuts: ProfileCutItem[];
  intermediateProfiles: ProfileCutItem[];
  glassPanes: GlassPaneItem[];
  totalGlassAreaM2: number;
  notes: string;
}

// 4. Glazing / Filling (Vanos y Acristalamiento)
export interface GlazingCalculationRequest {
  frameInnerWidthMm: number;
  frameInnerHeightMm: number;
  horizontalSplits?: number;
  verticalSplits?: number;
  clearancePerSideMm?: number; // calzos / holgura de acristalar, default 4mm
  glazingBeadSeries?: string;
  gasketPerimeterCount?: number;
}

export interface GlazingCalculationResult {
  frameInnerWidthMm: number;
  frameInnerHeightMm: number;
  panesCount: number;
  paneWidthMm: number;
  paneHeightMm: number;
  individualPaneAreaM2: number;
  totalGlassAreaM2: number;
  glazingBeadTotalMeters: number;
  gasketPerimeterMeters: number;
  glazingBlocksRecommended: number;
  notes: string;
}

// 5. Special Products: Grille (Rejas)
export interface GrilleCalculationRequest {
  openingWidthMm: number;
  openingHeightMm: number;
  material?: 'IRON' | 'ALUMINIUM';
  fixingType?: 'EMBEDDED' | 'SCREWED'; // EMBEDDED (+100mm por lado en obra) o SCREWED (4 escuadras)
  embeddedOverlapPerSideMm?: number;
  maxSpacingMm?: number; // default <= 130mm
  barThicknessMm?: number; // default 16mm
  hasCrossbars?: boolean;
}

export interface GrilleCalculationResult {
  openingWidthMm: number;
  openingHeightMm: number;
  material: string;
  fixingType: string;
  frameWidthMm: number;
  frameHeightMm: number;
  barCount: number;
  barLengthMm: number;
  spacingBetweenBarsMm: number;
  frameCuts: ProfileCutItem[];
  barsCuts: ProfileCutItem[];
  totalWeightKg?: number;
  fixingHardwareNeeded: string;
  notes: string;
}

// 6. Railings (Barandillas)
export interface RailingCalculationRequest {
  totalLengthMm: number;
  heightMm?: number; // standard 900mm or 1000mm
  postMaxSpacingMm?: number; // standard 1000mm
  material?: 'IRON' | 'ALUMINIUM';
  handrailType?: 'ROUND' | 'RECTANGULAR';
  infillType?: 'VERTICAL_BARS' | 'HORIZONTAL_BARS' | 'GLASS_PANELS';
}

export interface RailingCalculationResult {
  totalLengthMm: number;
  heightMm: number;
  material: string;
  postCount: number;
  handrailLengthMeters: number;
  bottomRailLengthMeters: number;
  basePlatesCount: number;
  infillSummary: string;
  components: ProfileCutItem[];
  notes: string;
}

// 7. Mosquito Nets (Mosquiteras)
export interface MosquitoNetCalculationRequest {
  windowWidthMm: number;
  windowHeightMm: number;
  leafCount?: number; // For sliding nets (correderas de hoja)
  type?: 'SLIDING' | 'ROLL_UP' | 'PLEATED' | 'FIXED' | 'PRACTICABLE';
}

export interface MosquitoNetCalculationResult {
  windowWidthMm: number;
  windowHeightMm: number;
  type: string;
  fabricationWidthMm: number;
  fabricationHeightMm: number;
  profileCuts: ProfileCutItem[];
  meshAreaM2: number;
  compatibleTrackWidthMm?: number;
  notes: string;
}
