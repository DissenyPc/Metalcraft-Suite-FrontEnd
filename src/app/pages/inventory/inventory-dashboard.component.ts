import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { AluminiumProfile } from '../../models/aluminium-profile.model';
import { IronProfile } from '../../models/iron-profile.model';
import { HardwareAccessory } from '../../models/hardware-accessory.model';
import { FillingMaterial } from '../../models/filling-material.model';
import { BulkPriceUpdateRequest, BatchAdjustRequest } from '../../models/bulk-price-update.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrls: ['./inventory.css']
  
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

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService) {}

  ngOnInit(): void {
  // 1. Lee la categoría de la URL y asegúrate de que encaja con tus tipos permitidos
  const categoryParam = this.route.snapshot.paramMap.get('category');
  
  if (categoryParam) {
    // Mapeamos el parámetro de la URL al valor que espera tu variable activeTab
    // (Ajusta los nombres según cómo los tengas definidos en tus tipos, ej: 'HARDWARE' o 'hardware')
    this.activeTab = categoryParam.toUpperCase() as any; 
  } else {
    this.activeTab = 'ALUMINIUM'; // Valor por defecto si entra a /inventory pelado
  }

  // 2. Cargamos los datos como hacías originalmente
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
