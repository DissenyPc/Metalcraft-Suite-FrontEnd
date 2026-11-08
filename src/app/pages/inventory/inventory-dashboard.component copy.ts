import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { AluminiumProfile } from '../../models/aluminium-profile.model';
import { IronProfile } from '../../models/iron-profile.model';
import { HardwareAccessory } from '../../models/hardware-accessory.model';
import { FillingMaterial } from '../../models/filling-material.model';
import { BulkPriceUpdateRequest, BatchAdjustRequest } from '../../models/bulk-price-update.model';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="inventory-dashboard animate-fade-in">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 class="h4 fw-bold text-dark mb-1">
            <i class="bi bi-boxes text-primary me-2"></i>Gestión de Inventario y Tarifas
          </h2>
          <p class="text-muted small mb-0">Control de stock, edición individual de tarifas, importación CSV y actualización porcentual masiva</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" (click)="openCsvModal()">
            <i class="bi bi-file-earmark-spreadsheet me-1"></i>Importar CSV
          </button>
          <button class="btn btn-warning text-dark fw-bold" (click)="openBulkPriceModal()">
            <i class="bi bi-percent me-1"></i>Actualización Masiva de Precios
          </button>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <ul class="nav nav-tabs nav-fill mb-4 card-custom p-1 bg-white border">
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeTab === 'ALUMINIUM'" (click)="setTab('ALUMINIUM')">
            <i class="bi bi-layers-half me-2"></i>Perfiles de Aluminio ({{ aluminiumList.length }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeTab === 'IRON'" (click)="setTab('IRON')">
            <i class="bi bi-hammer me-2"></i>Perfiles de Hierro / Acero ({{ ironList.length }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeTab === 'HARDWARE'" (click)="setTab('HARDWARE')">
            <i class="bi bi-gear-wide-connected me-2"></i>Herrajes y Accesorios ({{ hardwareList.length }})
          </button>
        </li>
        <li class="nav-item">
          <button class="nav-link py-3 fw-bold" [class.active]="activeTab === 'FILLING'" (click)="setTab('FILLING')">
            <i class="bi bi-window-stack me-2"></i>Vidrios y Paneles ({{ fillingList.length }})
          </button>
        </li>
      </ul>

      <!-- Search & Filters Toolbar -->
      <div class="card-custom p-3 mb-4">
        <div class="row g-3 align-items-center">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text bg-light border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input type="text" class="form-control border-start-0" placeholder="Buscar por referencia, serie o nombre..." [(ngModel)]="searchTerm" (input)="filterData()">
            </div>
          </div>
          <div class="col-md-4">
            <span class="text-muted small">Mostrando <strong>{{ getFilteredCount() }}</strong> registros</span>
          </div>
          <div class="col-md-2 text-end">
            <button class="btn btn-outline-secondary w-100 btn-sm" (click)="searchTerm = ''; filterData()">
              <i class="bi bi-arrow-counterclockwise me-1"></i>Limpiar
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 1: ALUMINIUM PROFILES -->
      @if (activeTab === 'ALUMINIUM') {
        <div class="card-custom overflow-hidden animate-fade-in">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light fs-xs text-uppercase text-muted">
                <tr>
                  <th style="width: 130px;">Referencia</th>
                  <th>Serie</th>
                  <th>Denominación</th>
                  <th class="text-end">Peso (kg/m)</th>
                  <th class="text-end">Longitud (m)</th>
                  <th class="text-end">Precio / metro</th>
                  <th class="text-end">Precio / barra</th>
                  <th class="text-center">Stock Barras</th>
                  <th class="text-center" style="width: 100px;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of filteredAluminium; track item.id) {
                  <tr>
                    <td class="font-mono fw-bold text-primary">{{ item.reference }}</td>
                    <td><span class="badge bg-light text-dark border">{{ item.series }}</span></td>
                    <td class="fw-medium">{{ item.name }}</td>
                    <td class="text-end font-mono">{{ (item.weightPerMeter || 0) | number:'1.2-3' }}</td>
                    <td class="text-end font-mono">{{ item.lengthMeters }} m</td>
                    <td class="text-end font-mono fw-bold text-dark">{{ item.pricePerMeter | number:'1.2-2' }} €</td>
                    <td class="text-end font-mono">{{ item.pricePerBar | number:'1.2-2' }} €</td>
                    <td class="text-center font-mono">
                      <span class="badge" [class.bg-success]="(item.stockBars || 0) > 5" [class.bg-warning]="(item.stockBars || 0) <= 5">
                        {{ item.stockBars || 0 }}
                      </span>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-primary p-1 px-2" (click)="editAluminium(item)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- TAB 2: IRON PROFILES -->
      @if (activeTab === 'IRON') {
        <div class="card-custom overflow-hidden animate-fade-in">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light fs-xs text-uppercase text-muted">
                <tr>
                  <th style="width: 130px;">Referencia</th>
                  <th>Perfil / Serie</th>
                  <th>Denominación</th>
                  <th class="text-end">Peso (kg/m)</th>
                  <th class="text-end">Precio / kg</th>
                  <th class="text-end">Precio / metro</th>
                  <th class="text-center">Stock Barras</th>
                  <th class="text-center" style="width: 100px;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of filteredIron; track item.id) {
                  <tr>
                    <td class="font-mono fw-bold text-primary">{{ item.reference }}</td>
                    <td><span class="badge bg-light text-dark border">{{ item.series }}</span></td>
                    <td class="fw-medium">{{ item.name }}</td>
                    <td class="text-end font-mono">{{ (item.weightPerMeter || 0) | number:'1.2-3' }}</td>
                    <td class="text-end font-mono">{{ (item.pricePerKg || 0) | number:'1.2-2' }} €</td>
                    <td class="text-end font-mono fw-bold text-dark">{{ item.pricePerMeter | number:'1.2-2' }} €</td>
                    <td class="text-center font-mono">
                      <span class="badge" [class.bg-success]="(item.stockBars || 0) > 5" [class.bg-warning]="(item.stockBars || 0) <= 5">
                        {{ item.stockBars || 0 }}
                      </span>
                    </td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-primary p-1 px-2" (click)="editIron(item)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- TAB 3: HARDWARE ACCESSORIES -->
      @if (activeTab === 'HARDWARE') {
        <div class="card-custom overflow-hidden animate-fade-in">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light fs-xs text-uppercase text-muted">
                <tr>
                  <th style="width: 130px;">Referencia</th>
                  <th>Categoría</th>
                  <th>Descripción</th>
                  <th class="text-end">Precio Venta (PVP)</th>
                  <th class="text-center">Stock Actual</th>
                  <th class="text-center">Stock Mínimo</th>
                  <th class="text-center">Alerta Stock</th>
                  <th class="text-center" style="width: 100px;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of filteredHardware; track item.id) {
                  <tr>
                    <td class="font-mono fw-bold text-primary">{{ item.reference }}</td>
                    <td><span class="badge bg-light text-dark border">{{ item.category }}</span></td>
                    <td class="fw-medium">{{ item.name }}</td>
                    <td class="text-end font-mono fw-bold text-dark">{{ item.salePrice | number:'1.2-2' }} €</td>
                    <td class="text-center font-mono">{{ item.stockQuantity }} ud</td>
                    <td class="text-center font-mono text-muted">{{ item.minStockAlert }} ud</td>
                    <td class="text-center">
                      @if (item.stockQuantity <= item.minStockAlert) {
                        <span class="badge bg-danger">
                          <i class="bi bi-exclamation-triangle-fill me-1"></i>Bajo
                        </span>
                      } @else {
                        <span class="badge bg-success">Correcto</span>
                      }
                    </td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-primary p-1 px-2" (click)="editHardware(item)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- TAB 4: FILLING MATERIALS -->
      @if (activeTab === 'FILLING') {
        <div class="card-custom overflow-hidden animate-fade-in">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light fs-xs text-uppercase text-muted">
                <tr>
                  <th style="width: 130px;">Referencia</th>
                  <th>Tipo Material</th>
                  <th>Denominación</th>
                  <th class="text-end">Espesor (mm)</th>
                  <th class="text-end">Precio / m²</th>
                  <th class="text-center">Stock (m²)</th>
                  <th class="text-center" style="width: 100px;">Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (item of filteredFilling; track item.id) {
                  <tr>
                    <td class="font-mono fw-bold text-primary">{{ item.reference }}</td>
                    <td><span class="badge bg-light text-dark border">{{ item.materialType }}</span></td>
                    <td class="fw-medium">{{ item.name }}</td>
                    <td class="text-end font-mono">{{ item.thicknessMm || '—' }}</td>
                    <td class="text-end font-mono fw-bold text-dark">{{ item.pricePerSquareMeter | number:'1.2-2' }} €</td>
                    <td class="text-center font-mono">{{ item.stockM2 | number:'1.2-2' }} m²</td>
                    <td class="text-center">
                      <button class="btn btn-sm btn-outline-primary p-1 px-2" (click)="editFilling(item)" title="Editar">
                        <i class="bi bi-pencil"></i>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- BULK PRICE UPDATE MODAL -->
      @if (showBulkPriceModal) {
        <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0">
              <div class="modal-header bg-warning bg-opacity-25">
                <h5 class="modal-title fw-bold">
                  <i class="bi bi-percent text-warning me-2"></i>Actualización Porcentual de Precios
                </h5>
                <button type="button" class="btn-close" (click)="showBulkPriceModal = false"></button>
              </div>
              <div class="modal-body p-4">
                <p class="small text-muted mb-3">
                  Aplica un incremento o decremento porcentual masivo a los precios del catálogo.
                </p>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Familia / Catálogo Destino</label>
                  <select class="form-select" [(ngModel)]="bulkRequest.targetCatalog">
                    <option value="ALUMINIUM">Perfiles de Aluminio</option>
                    <option value="IRON">Perfiles de Hierro / Acero</option>
                    <option value="HARDWARE">Herrajes y Accesorios</option>
                    <option value="FILLING">Vidrios y Paneles</option>
                    <option value="ALL">Todo el Inventario</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Porcentaje de Modificación (%)</label>
                  <div class="input-group">
                    <input type="number" class="form-control font-mono fw-bold text-end" [(ngModel)]="bulkRequest.percentage" step="0.5" placeholder="Ej. 5 para +5% o -3 para -3%">
                    <span class="input-group-text">%</span>
                  </div>
                  <small class="text-muted">Introduzca valores positivos para subida (ej. 5.5%) o negativos para rebaja (ej. -2%).</small>
                </div>
              </div>
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary btn-sm" (click)="showBulkPriceModal = false">Cancelar</button>
                <button type="button" class="btn btn-warning btn-sm fw-bold" (click)="applyBulkPriceUpdate()" [disabled]="applyingBulk">
                  @if (applyingBulk) {
                    <span class="spinner-border spinner-border-sm me-1"></span>Aplicando...
                  } @else {
                    <i class="bi bi-check2-circle me-1"></i>Aplicar Variación de Precios
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- CSV IMPORT MODAL -->
      @if (showCsvModal) {
        <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0">
              <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold">
                  <i class="bi bi-file-earmark-arrow-up text-primary me-2"></i>Importación de Catálogo CSV
                </h5>
                <button type="button" class="btn-close" (click)="showCsvModal = false"></button>
              </div>
              <div class="modal-body p-4">
                <p class="small text-muted mb-3">
                  Cargue tarifas suministradas por fabricantes o distribuidores en formato CSV. Los registros con referencia existente se actualizarán y los nuevos se insertarán.
                </p>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Tipo de Catálogo a Importar</label>
                  <select class="form-select" [(ngModel)]="csvCatalogType">
                    <option value="ALUMINIUM">Perfiles de Aluminio</option>
                    <option value="IRON">Perfiles de Hierro / Acero</option>
                    <option value="HARDWARE">Herrajes y Accesorios</option>
                    <option value="FILLING">Vidrios y Paneles</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Seleccionar Archivo CSV (.csv)</label>
                  <input type="file" class="form-control" (change)="onFileSelected($event)" accept=".csv">
                </div>
                @if (selectedFile) {
                  <div class="alert alert-info py-2 small mb-0">
                    <i class="bi bi-check-circle me-1"></i>Archivo seleccionado: <strong>{{ selectedFile.name }}</strong> ({{ (selectedFile.size / 1024) | number:'1.1-1' }} KB)
                  </div>
                }
              </div>
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary btn-sm" (click)="showCsvModal = false">Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm" (click)="importCsvFile()" [disabled]="!selectedFile || importingCsv">
                  @if (importingCsv) {
                    <span class="spinner-border spinner-border-sm me-1"></span>Importando...
                  } @else {
                    <i class="bi bi-upload me-1"></i>Procesar CSV
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- INDIVIDUAL ITEM EDIT MODAL -->
      @if (editingItem) {
        <div class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0">
              <div class="modal-header bg-light">
                <h5 class="modal-title fw-bold">
                  <i class="bi bi-pencil-square text-primary me-2"></i>Editar Artículo: {{ editingItem.reference }}
                </h5>
                <button type="button" class="btn-close" (click)="editingItem = null"></button>
              </div>
              <div class="modal-body p-4">
                <div class="mb-3">
                  <label class="form-label small fw-semibold">Denominación</label>
                  <input type="text" class="form-control" [(ngModel)]="editingItem.name">
                </div>
                <div class="row g-2 mb-3">
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Precio Principal (€)</label>
                    <input type="number" class="form-control font-mono text-end" [(ngModel)]="editingItemPrice" step="0.01">
                  </div>
                  <div class="col-6">
                    <label class="form-label small fw-semibold">Stock Actual</label>
                    <input type="number" class="form-control font-mono text-center" [(ngModel)]="editingItemStock">
                  </div>
                </div>
              </div>
              <div class="modal-footer bg-light">
                <button type="button" class="btn btn-secondary btn-sm" (click)="editingItem = null">Cancelar</button>
                <button type="button" class="btn btn-primary btn-sm" (click)="saveEditedItem()">
                  <i class="bi bi-check-lg me-1"></i>Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .fs-xs { font-size: 0.75rem; }
  `]
})
export class InventoryDashboardComponent implements OnInit {
  activeTab: 'ALUMINIUM' | 'IRON' | 'HARDWARE' | 'FILLING' = 'ALUMINIUM';
  searchTerm = '';

  aluminiumList: AluminiumProfile[] = [];
  filteredAluminium: AluminiumProfile[] = [];

  ironList: IronProfile[] = [];
  filteredIron: IronProfile[] = [];

  hardwareList: HardwareAccessory[] = [];
  filteredHardware: HardwareAccessory[] = [];

  fillingList: FillingMaterial[] = [];
  filteredFilling: FillingMaterial[] = [];

  // Modals
  showBulkPriceModal = false;
  bulkRequest = {
    targetCatalog: 'ALUMINIUM',
    percentage: 5.0
  };
  applyingBulk = false;

  showCsvModal = false;
  csvCatalogType: 'ALUMINIUM' | 'IRON' | 'HARDWARE' | 'FILLING' = 'ALUMINIUM';
  selectedFile: File | null = null;
  importingCsv = false;

  // Individual Edit
  editingItem: any = null;
  editingItemPrice = 0;
  editingItemStock = 0;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  setTab(tab: 'ALUMINIUM' | 'IRON' | 'HARDWARE' | 'FILLING'): void {
    this.activeTab = tab;
    this.filterData();
  }

  loadAllData(): void {
    this.inventoryService.getAluminiumProfiles().subscribe(data => {
      this.aluminiumList = data;
      this.filterData();
    });
    this.inventoryService.getIronProfiles().subscribe(data => {
      this.ironList = data;
      this.filterData();
    });
    this.inventoryService.getHardwareAccessories().subscribe(data => {
      this.hardwareList = data;
      this.filterData();
    });
    this.inventoryService.getFillingMaterials().subscribe(data => {
      this.fillingList = data;
      this.filterData();
    });
  }

  filterData(): void {
    const q = this.searchTerm.toLowerCase().trim();

    this.filteredAluminium = this.aluminiumList.filter(i =>
      !q || i.reference.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || (i.series && i.series.toLowerCase().includes(q))
    );

    this.filteredIron = this.ironList.filter(i =>
      !q || i.reference.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || (i.series && i.series.toLowerCase().includes(q))
    );

    this.filteredHardware = this.hardwareList.filter(i =>
      !q || i.reference.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || (i.category && i.category.toLowerCase().includes(q))
    );

    this.filteredFilling = this.fillingList.filter(i =>
      !q || i.reference.toLowerCase().includes(q) || i.name.toLowerCase().includes(q) || (i.materialType && i.materialType.toLowerCase().includes(q))
    );
  }

  getFilteredCount(): number {
    if (this.activeTab === 'ALUMINIUM') return this.filteredAluminium.length;
    if (this.activeTab === 'IRON') return this.filteredIron.length;
    if (this.activeTab === 'HARDWARE') return this.filteredHardware.length;
    return this.filteredFilling.length;
  }

  openBulkPriceModal(): void {
    this.bulkRequest.targetCatalog = this.activeTab;
    this.showBulkPriceModal = true;
  }

  applyBulkPriceUpdate(): void {
    this.applyingBulk = true;

    if (this.bulkRequest.targetCatalog === 'ALL') {
      const batchReq: BatchAdjustRequest = {
        targetTable: 'ALUMINIUM_PROFILES',
        percentage: this.bulkRequest.percentage
      };
      this.inventoryService.batchAdjust(batchReq).subscribe({
        next: (res) => {
          this.applyingBulk = false;
          this.showBulkPriceModal = false;
          alert(`Actualización masiva completada: ${res.updatedCount} registros actualizados.`);
          this.loadAllData();
        },
        error: () => { this.applyingBulk = false; alert('Error al actualizar precios globales.'); }
      });
    } else {
      const catalog = this.bulkRequest.targetCatalog as 'ALUMINIUM' | 'IRON' | 'HARDWARE' | 'FILLING';
      this.inventoryService.bulkPercentageUpdate(catalog, this.bulkRequest.percentage).subscribe({
        next: (res) => {
          this.applyingBulk = false;
          this.showBulkPriceModal = false;
          alert(`Actualización masiva completada: ${res.updatedCount} artículos actualizados.`);
          this.loadAllData();
        },
        error: () => { this.applyingBulk = false; alert('Error al actualizar precios.'); }
      });
    }
  }

  openCsvModal(): void {
    this.csvCatalogType = this.activeTab;
    this.selectedFile = null;
    this.showCsvModal = true;
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  importCsvFile(): void {
    if (!this.selectedFile) return;
    this.importingCsv = true;

    this.inventoryService.importCsv(this.csvCatalogType, this.selectedFile).subscribe({
      next: (res) => {
        this.importingCsv = false;
        this.showCsvModal = false;
        alert(`Importación completada con éxito. Insertados: ${res.createdCount || 0}, Actualizados: ${res.updatedCount || 0}`);
        this.loadAllData();
      },
      error: (err) => {
        this.importingCsv = false;
        console.error('Error importando CSV:', err);
        alert('Error durante la importación del archivo CSV.');
      }
    });
  }

  editAluminium(item: AluminiumProfile): void {
    this.editingItem = { ...item, _type: 'ALUMINIUM' };
    this.editingItemPrice = item.pricePerMeter;
    this.editingItemStock = item.stockBars || 0;
  }

  editIron(item: IronProfile): void {
    this.editingItem = { ...item, _type: 'IRON' };
    this.editingItemPrice = item.pricePerMeter;
    this.editingItemStock = item.stockBars || 0;
  }

  editHardware(item: HardwareAccessory): void {
    this.editingItem = { ...item, _type: 'HARDWARE' };
    this.editingItemPrice = item.salePrice;
    this.editingItemStock = item.stockQuantity;
  }

  editFilling(item: FillingMaterial): void {
    this.editingItem = { ...item, _type: 'FILLING' };
    this.editingItemPrice = item.pricePerSquareMeter;
    this.editingItemStock = item.stockM2;
  }

  saveEditedItem(): void {
    if (!this.editingItem) return;

    if (this.editingItem._type === 'ALUMINIUM') {
      this.editingItem.pricePerMeter = this.editingItemPrice;
      this.editingItem.stockBars = this.editingItemStock;
      this.inventoryService.updateAluminiumProfile(this.editingItem.id, this.editingItem).subscribe(() => {
        this.editingItem = null;
        this.loadAllData();
      });
    } else if (this.editingItem._type === 'IRON') {
      this.editingItem.pricePerMeter = this.editingItemPrice;
      this.editingItem.stockBars = this.editingItemStock;
      this.inventoryService.updateIronProfile(this.editingItem.id, this.editingItem).subscribe(() => {
        this.editingItem = null;
        this.loadAllData();
      });
    } else if (this.editingItem._type === 'HARDWARE') {
      this.editingItem.salePrice = this.editingItemPrice;
      this.editingItem.stockQuantity = this.editingItemStock;
      this.inventoryService.updateHardwareAccessory(this.editingItem.id, this.editingItem).subscribe(() => {
        this.editingItem = null;
        this.loadAllData();
      });
    } else if (this.editingItem._type === 'FILLING') {
      this.editingItem.pricePerSquareMeter = this.editingItemPrice;
      this.editingItem.stockM2 = this.editingItemStock;
      this.inventoryService.updateFillingMaterial(this.editingItem.id, this.editingItem).subscribe(() => {
        this.editingItem = null;
        this.loadAllData();
      });
    }
  }
}
