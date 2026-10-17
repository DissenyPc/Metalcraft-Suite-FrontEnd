import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BudgetService } from '../../../services/budget.service';
import { CalculatorService } from '../../../services/calculator.service';
import { AluminiumProfileService } from '../../../services/aluminium-profile.service';
import { HardwareAccessoryService } from '../../../services/hardware-accessory.service';
import { FillingMaterialService } from '../../../services/filling-material.service';
import { BudgetItem, Budget } from '../../../models/budget.model';
import {
  StructureCalculationResult,
  ShutterCalculationResult,
  FixedModuleCalculationResult,
  GlazingCalculationResult
} from '../../../models/calculator.model';

@Component({
  selector: 'app-budget-item-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="calculator-stepper-page animate-fade-in">
      <!-- Header -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-1 small">
              <li class="breadcrumb-item"><a routerLink="/budgets" class="text-decoration-none">Presupuestos</a></li>
              <li class="breadcrumb-item">
                <a [routerLink]="['/budgets', budgetId]" class="text-decoration-none">{{ budget?.budgetNumber || 'Presupuesto' }}</a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">Configurador de Partida</li>
            </ol>
          </nav>
          <h2 class="h4 fw-bold text-dark mb-0">
            <i class="bi bi-window-split text-primary me-2"></i>Configurador Interactivo de Ventanas y Cerramientos
          </h2>
        </div>
        <div>
          <a [routerLink]="['/budgets', budgetId]" class="btn btn-outline-secondary">
            <i class="bi bi-arrow-left me-1"></i>Volver al Presupuesto
          </a>
        </div>
      </div>

      <!-- Step Indicator Bar -->
      <div class="stepper-nav card-custom p-3 mb-4">
        <div class="row g-2 text-center">
          <div class="col" [class.step-active]="currentStep === 1" [class.step-done]="currentStep > 1" (click)="goToStep(1)">
            <div class="step-pill">
              <span class="step-num">1</span>
              <span class="step-title">Serie y Acabado</span>
            </div>
          </div>
          <div class="col" [class.step-active]="currentStep === 2" [class.step-done]="currentStep > 2" (click)="goToStep(2)">
            <div class="step-pill">
              <span class="step-num">2</span>
              <span class="step-title">Hueco Obra</span>
            </div>
          </div>
          <div class="col" [class.step-active]="currentStep === 3" [class.step-done]="currentStep > 3" (click)="goToStep(3)">
            <div class="step-pill">
              <span class="step-num">3</span>
              <span class="step-title">Solapes</span>
            </div>
          </div>
          <div class="col" [class.step-active]="currentStep === 4" [class.step-done]="currentStep > 4" (click)="goToStep(4)">
            <div class="step-pill">
              <span class="step-num">4</span>
              <span class="step-title">Persiana Compacto</span>
            </div>
          </div>
          <div class="col" [class.step-active]="currentStep === 5" [class.step-done]="currentStep > 5" (click)="goToStep(5)">
            <div class="step-pill">
              <span class="step-num">5</span>
              <span class="step-title">Fijos y Luces</span>
            </div>
          </div>
          <div class="col" [class.step-active]="currentStep === 6" [class.step-done]="currentStep > 6" (click)="goToStep(6)">
            <div class="step-pill">
              <span class="step-num">6</span>
              <span class="step-title">Desglose y Precio</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step Content Area -->
      <div class="row g-4">
        <!-- Main Form Column -->
        <div class="col-lg-8">
          <div class="card-custom p-4 min-vh-50">
            <!-- STEP 1: Serie y Acabado -->
            @if (currentStep === 1) {
              <div class="step-pane animate-fade-in">
                <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                  <i class="bi bi-palette me-2"></i>Paso 1: Tipología, Serie de Hojas y Acabado
                </h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Tipo de Elemento</label>
                    <select class="form-select" [(ngModel)]="config.elementTypology">
                      <option value="WINDOW">Ventana</option>
                      <option value="BALCONY">Balconera / Puerta Balcón</option>
                      <option value="DOOR">Puerta Entrada</option>
                      <option value="FIXED_FRAME">Cerramiento Fijo</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Sistema de Apertura</label>
                    <select class="form-select" [(ngModel)]="config.openingSystem">
                      <option value="PRACTICABLE">Practicable / Oscilobatiente</option>
                      <option value="SLIDING">Corredera</option>
                      <option value="TILT_TURN">Oscilobatiente 1ª Hoja</option>
                      <option value="PIVOTING">Pivotante</option>
                      <option value="FIXED">Fijo sin apertura</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Número de Hojas</label>
                    <select class="form-select" [(ngModel)]="config.leavesCount">
                      <option [ngValue]="1">1 Hoja</option>
                      <option [ngValue]="2">2 Hojas</option>
                      <option [ngValue]="3">3 Hojas</option>
                      <option [ngValue]="4">4 Hojas</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Serie de Perfilería</label>
                    <select class="form-select" [(ngModel)]="config.series">
                      <option value="EUROPEAN_40">Serie Europea 40 mm (Cámara Europea)</option>
                      <option value="RPT_65">Rotura de Puente Térmico RPT 65 mm</option>
                      <option value="RPT_75">RPT Alta Eficiencia 75 mm</option>
                      <option value="SLIDING_70">Corredera Perimetral 70 mm</option>
                      <option value="SLIDING_MINIMAL">Corredera Línea Minimalista</option>
                      <option value="STEEL_TUBULAR">Tubo Acero / Hierro Forja</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Acabado / Tratamiento Superficial</label>
                    <select class="form-select" [(ngModel)]="config.finish">
                      <option value="BLANCO_9016">Lacado Blanco RAL 9016</option>
                      <option value="ANODIZADO_PLATA">Anodizado Plata Mate (15 micras)</option>
                      <option value="ANODIZADO_BRONCE">Anodizado Bronce / Inox</option>
                      <option value="RAL_7016_ANTRACITA">Lacado Gris Antracita RAL 7016 Texturado</option>
                      <option value="MADERA_EMBERO">Efecto Madera Embero / Nogal</option>
                      <option value="RAL_ESPECIAL">Carta RAL a Elegir</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Vidrio Previsto</label>
                    <select class="form-select" [(ngModel)]="config.glassType">
                      <option value="CLIMALIT_4_16_4">Doble Acristalamiento 4 / 16 / 4 Transparente</option>
                      <option value="CLIMALIT_BAJO_EMISIVO">4 / 16 / 4 Bajo Emisivo Guardian Sun</option>
                      <option value="LAMINAR_33_12_4">Laminar Seguridad 3+3 / 12 / 4</option>
                      <option value="TRIPLE_VIDRIO">Triple Vidrio 4 / 12 / 4 / 12 / 4</option>
                      <option value="PANEL_SANDWICH">Panel Sandwich Ciego 20 mm</option>
                    </select>
                  </div>
                </div>
              </div>
            }

            <!-- STEP 2: Hueco Obra -->
            @if (currentStep === 2) {
              <div class="step-pane animate-fade-in">
                <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                  <i class="bi bi-aspect-ratio me-2"></i>Paso 2: Dimensiones de Hueco de Obra
                </h5>
                <p class="text-muted small">Introduzca las medidas reales tomadas en obra (luz de hueco) en milímetros.</p>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Ancho de Hueco (Luz X) (mm) *</label>
                    <div class="input-group">
                      <input type="number" class="form-control font-mono fw-bold text-end" [(ngModel)]="config.openingWidthMm" min="300" max="6000" step="1">
                      <span class="input-group-text">mm</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Alto de Hueco (Luz Y) (mm) *</label>
                    <div class="input-group">
                      <input type="number" class="form-control font-mono fw-bold text-end" [(ngModel)]="config.openingHeightMm" min="300" max="4000" step="1">
                      <span class="input-group-text">mm</span>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Cantidad de Elementos Iguales</label>
                    <input type="number" class="form-control font-mono text-center" [(ngModel)]="config.quantity" min="1" step="1">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Longitud de Barra Comercial Stock</label>
                    <select class="form-select font-mono" [(ngModel)]="config.commercialBarLengthMm">
                      <option [ngValue]="6000">6.000 mm (6 m estándar)</option>
                      <option [ngValue]="6500">6.500 mm (6,5 m especial)</option>
                    </select>
                  </div>
                  <div class="col-12 mt-4">
                    <div class="alert alert-info py-2 small d-flex align-items-center">
                      <i class="bi bi-info-circle-fill fs-5 me-2"></i>
                      <span>Área total de hueco: <strong>{{ ((config.openingWidthMm * config.openingHeightMm) / 1000000) | number:'1.2-2' }} m²</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- STEP 3: Solapes -->
            @if (currentStep === 3) {
              <div class="step-pane animate-fade-in">
                <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                  <i class="bi bi-arrows-collapse me-2"></i>Paso 3: Configuración de Solapes y Tapajuntas
                </h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Solape perimetral por lado (mm)</label>
                    <select class="form-select font-mono" [(ngModel)]="config.solapePerSideMm">
                      <option [ngValue]="0">Sin solape / Marco liso (0 mm)</option>
                      <option [ngValue]="20">Solape estándar 20 mm</option>
                      <option [ngValue]="30">Solape amplio 30 mm</option>
                      <option [ngValue]="40">Solape tapajuntas 40 mm</option>
                      <option [ngValue]="50">Solape especial 50 mm</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Tipo de Fijación a Obra</label>
                    <select class="form-select" [(ngModel)]="config.fixingType">
                      <option value="SCREW_ANCHOR">Tornillería directa / Taco químico</option>
                      <option value="PREFRAME">Sobre premarco de aluminio existente</option>
                      <option value="EMBEDDED">Garfas recibidas con mortero</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <div class="card p-3 bg-light border">
                      <h6 class="fw-bold small mb-2 text-dark">Dimensiones Resultantes de Fabricación:</h6>
                      <div class="row text-center">
                        <div class="col-6 border-end">
                          <span class="small text-muted">Ancho Fabricación Marco:</span>
                          <div class="h5 font-mono fw-bold text-primary mb-0">
                            {{ config.openingWidthMm - (config.solapePerSideMm * 2) }} mm
                          </div>
                        </div>
                        <div class="col-6">
                          <span class="small text-muted">Alto Fabricación Marco:</span>
                          <div class="h5 font-mono fw-bold text-primary mb-0">
                            {{ config.openingHeightMm - (config.solapePerSideMm * 2) }} mm
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- STEP 4: Persiana Compacto -->
            @if (currentStep === 4) {
              <div class="step-pane animate-fade-in">
                <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                  <i class="bi bi-segmented-nav me-2"></i>Paso 4: Persiana Compacto (Monoblock)
                </h5>
                <div class="form-check form-switch mb-3">
                  <input class="form-check-input" type="checkbox" id="hasShutterSwitch" [(ngModel)]="config.hasShutter">
                  <label class="form-check-label fw-bold" for="hasShutterSwitch">
                    Incorporar cajón de persiana compacto monoblock
                  </label>
                </div>

                @if (config.hasShutter) {
                  <div class="row g-3 bg-light p-3 rounded-2 border">
                    <div class="col-md-6">
                      <label class="form-label small fw-semibold">Altura del Cajón Compacto (mm)</label>
                      <select class="form-select font-mono" [(ngModel)]="config.shutterBoxHeightMm">
                        <option [ngValue]="155">155 mm (Hasta 1.50m alto ventana)</option>
                        <option [ngValue]="185">185 mm (Estándar ventanas balconeras)</option>
                        <option [ngValue]="200">200 mm (Puertas altas / doble lama)</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-semibold">Tipo de Accionamiento</label>
                      <select class="form-select" [(ngModel)]="config.shutterWinderType">
                        <option value="BUILT_IN">Recogedor cinta embutido en marco (-30mm deducción)</option>
                        <option value="EXTERNAL_STRAP">Cinta abatible exterior / pasacintas</option>
                        <option value="MOTORIZED">Motor tubular con mando / pulsador</option>
                        <option value="CRANK">Manivela / torno articulado</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-semibold">Tipo de Lama de Persiana</label>
                      <select class="form-select" [(ngModel)]="config.shutterSlatType">
                        <option value="ALUMINIO_TERMICO">Aluminio perfilado térmico (Espuma poliuretano)</option>
                        <option value="ALUMINIO_EXTRUSION">Aluminio extrusión autoblocante seguridad</option>
                        <option value="PVC">Lama PVC estándar</option>
                      </select>
                    </div>
                    <div class="col-md-6">
                      <label class="form-label small fw-semibold">Guías de Persiana</label>
                      <select class="form-select" [(ngModel)]="config.shutterGuideType">
                        <option value="GUIA_CON_FELPUDO">Guía con felpudo silencioso antiviento</option>
                        <option value="GUIA_CON_MOSQUITERA">Guía combinada persiana + mosquitera</option>
                      </select>
                    </div>
                    <div class="col-12 mt-2">
                      <div class="alert alert-warning py-2 small mb-0">
                        <i class="bi bi-exclamation-triangle me-1"></i>
                        Alto útil resultante de ventana bajo cajón:
                        <strong class="font-mono">{{ config.openingHeightMm - config.shutterBoxHeightMm }} mm</strong>
                      </div>
                    </div>
                  </div>
                } @else {
                  <p class="text-muted small">No se incorporará persiana. La estructura ocupará la totalidad de la altura descontando solapes.</p>
                }
              </div>
            }

            <!-- STEP 5: Fijos y Luces -->
            @if (currentStep === 5) {
              <div class="step-pane animate-fade-in">
                <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                  <i class="bi bi-layout-sidebar-inset me-2"></i>Paso 5: Módulos Fijos y División de Luces / Vanos
                </h5>
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Disposición de Módulo Fijo</label>
                    <select class="form-select" [(ngModel)]="config.fixedDisposition">
                      <option value="NONE">Sin módulo fijo (solo hojas practicables)</option>
                      <option value="TOP">Fijo superior (Montante fijo)</option>
                      <option value="BOTTOM">Fijo inferior (Antepecho)</option>
                      <option value="LEFT">Fijo lateral izquierdo</option>
                      <option value="RIGHT">Fijo lateral derecho</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Perfil Divisor Travesaño</label>
                    <select class="form-select" [(ngModel)]="config.transomProfileType">
                      <option value="T_TRANSOM">Perfil en T integrado (Serie perimetral)</option>
                      <option value="H_COUPLER">Perfil H acoplador (Marcos independientes)</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Divisiones Horizontales (Travesaños)</label>
                    <input type="number" class="form-control font-mono text-center" [(ngModel)]="config.horizontalDivisions" min="0" max="5" step="1">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label small fw-semibold">Divisiones Verticales (Montantes)</label>
                    <input type="number" class="form-control font-mono text-center" [(ngModel)]="config.verticalDivisions" min="0" max="5" step="1">
                  </div>
                  <div class="col-12">
                    <div class="card p-3 bg-light border">
                      <span class="small text-muted">Total de luces / vanos acristalados resultantes:</span>
                      <div class="h5 font-mono fw-bold text-dark mb-0">
                        {{ (config.horizontalDivisions + 1) * (config.verticalDivisions + 1) }} vanos
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- STEP 6: Desglose y Precio en Vivo -->
            @if (currentStep === 6) {
              <div class="step-pane animate-fade-in">
                <h5 class="fw-bold mb-3 text-primary border-bottom pb-2">
                  <i class="bi bi-receipt-cutoff me-2"></i>Paso 6: Vista Previa y Desglose de Costes (BOM)
                </h5>

                @if (calculating) {
                  <div class="text-center py-4">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="text-muted mt-2">Calculando despiece y costes...</p>
                  </div>
                } @else {
                  <!-- BOM Breakdown Tables -->
                  <div class="mb-4">
                    <h6 class="fw-bold small text-uppercase text-muted mb-2">Desglose de Materiales y Costes:</h6>
                    <div class="table-responsive">
                      <table class="table table-sm table-bordered align-middle">
                        <thead class="table-light fs-xs text-muted">
                          <tr>
                            <th>Concepto</th>
                            <th class="text-center">Detalle / Medidas</th>
                            <th class="text-center">Cantidad</th>
                            <th class="text-end">Importe Estimado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td class="fw-semibold">
                              <i class="bi bi-border-outer text-primary me-1"></i>Perfilería Marco y Hojas
                            </td>
                            <td class="small font-mono">{{ calcResult?.totalProfileLengthMeters || 6.8 | number:'1.2-2' }} m lineales</td>
                            <td class="text-center font-mono">{{ calcResult?.commercialBarsNeeded || 2 }} barras</td>
                            <td class="text-end font-mono">{{ priceBreakdown.profiles | number:'1.2-2' }} €</td>
                          </tr>
                          <tr>
                            <td class="fw-semibold">
                              <i class="bi bi-window text-info me-1"></i>Acristalamiento / Paneles
                            </td>
                            <td class="small font-mono">{{ glazingResult?.totalGlassAreaM2 || 1.35 | number:'1.2-2' }} m² ({{ config.glassType }})</td>
                            <td class="text-center font-mono">{{ config.leavesCount }} vidrios</td>
                            <td class="text-end font-mono">{{ priceBreakdown.glass | number:'1.2-2' }} €</td>
                          </tr>
                          @if (config.hasShutter) {
                            <tr>
                              <td class="fw-semibold">
                                <i class="bi bi-segmented-nav text-secondary me-1"></i>Persiana Compacto + Motor/Cinta
                              </td>
                              <td class="small">Cajón {{ config.shutterBoxHeightMm }}mm con lamas térmicas</td>
                              <td class="text-center font-mono">1 kit</td>
                              <td class="text-end font-mono">{{ priceBreakdown.shutter | number:'1.2-2' }} €</td>
                            </tr>
                          }
                          <tr>
                            <td class="fw-semibold">
                              <i class="bi bi-gear-wide text-warning me-1"></i>Herrajes, Juntas y Accesorios
                            </td>
                            <td class="small">Cierres, bisagras, escuadras, gomas EPDM y calzos</td>
                            <td class="text-center font-mono">1 juego</td>
                            <td class="text-end font-mono">{{ priceBreakdown.hardware | number:'1.2-2' }} €</td>
                          </tr>
                          <tr>
                            <td class="fw-semibold">
                              <i class="bi bi-person-workspace text-success me-1"></i>Mano de Obra y Fabricación en Taller
                            </td>
                            <td class="small">Corte, mecanizado de desagües, ensamblado y acristalado</td>
                            <td class="text-center font-mono">2,5 h</td>
                            <td class="text-end font-mono">{{ priceBreakdown.labor | number:'1.2-2' }} €</td>
                          </tr>
                        </tbody>
                        <tfoot class="table-light">
                          <tr>
                            <th colspan="3" class="text-end">Coste Unitario de Fabricación:</th>
                            <th class="text-end font-mono text-dark">{{ unitPrice | number:'1.2-2' }} €</th>
                          </tr>
                          <tr>
                            <th colspan="3" class="text-end text-primary fs-6">TOTAL PARTIDA ({{ config.quantity }} ud{{ config.quantity > 1 ? 's' : '' }}):</th>
                            <th class="text-end font-mono fs-5 fw-bold text-primary">{{ totalPrice | number:'1.2-2' }} €</th>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  <!-- Cut List Summary -->
                  @if (calcResult?.cuts && calcResult!.cuts.length > 0) {
                    <div class="mt-3">
                      <h6 class="fw-bold small text-uppercase text-muted mb-2">Lista de Corte de Perfiles Generada:</h6>
                      <div class="bg-light p-2 rounded-2 border">
                        <ul class="list-unstyled mb-0 small font-mono">
                          @for (cut of calcResult!.cuts; track cut.pieceDescription) {
                            <li class="d-flex justify-content-between py-1 border-bottom border-light">
                              <span>{{ cut.pieceDescription }} ({{ cut.quantity }}x)</span>
                              <span class="fw-bold">{{ cut.lengthMm }} mm [{{ cut.mitreAngle || '45°/45°' }}]</span>
                            </li>
                          }
                        </ul>
                      </div>
                    </div>
                  }
                }
              </div>
            }

            <!-- Stepper Actions Button Bar -->
            <div class="d-flex justify-content-between mt-4 pt-3 border-top">
              <button class="btn btn-outline-secondary" (click)="prevStep()" [disabled]="currentStep === 1">
                <i class="bi bi-chevron-left me-1"></i>Anterior
              </button>

              @if (currentStep < 6) {
                <button class="btn btn-primary" (click)="nextStep()">
                  Siguiente<i class="bi bi-chevron-right ms-1"></i>
                </button>
              } @else {
                <button class="btn btn-success fw-bold px-4" (click)="addPartidaToBudget()" [disabled]="adding">
                  @if (adding) {
                    <span class="spinner-border spinner-border-sm me-1"></span>Añadiendo...
                  } @else {
                    <i class="bi bi-check-circle-fill me-1"></i>Añadir Partida al Presupuesto
                  }
                </button>
              }
            </div>
          </div>
        </div>

        <!-- Sidebar Summary Box -->
        <div class="col-lg-4">
          <div class="card-custom p-4 sticky-top" style="top: 80px;">
            <h5 class="fw-bold mb-3 border-bottom pb-2">
              <i class="bi bi-eye text-primary me-2"></i>Resumen de Configuración
            </h5>
            <div class="mb-2">
              <span class="small text-muted d-block">Tipo y Apertura:</span>
              <strong class="small">{{ config.elementTypology }} - {{ config.openingSystem }} ({{ config.leavesCount }}H)</strong>
            </div>
            <div class="mb-2">
              <span class="small text-muted d-block">Serie y Acabado:</span>
              <span class="small">{{ config.series }} / {{ config.finish }}</span>
            </div>
            <div class="mb-2">
              <span class="small text-muted d-block">Hueco Obra (Ancho x Alto):</span>
              <span class="font-mono fw-bold text-dark">{{ config.openingWidthMm }} x {{ config.openingHeightMm }} mm</span>
            </div>
            <div class="mb-2">
              <span class="small text-muted d-block">Solape:</span>
              <span class="small font-mono">{{ config.solapePerSideMm }} mm por lado</span>
            </div>
            <div class="mb-2">
              <span class="small text-muted d-block">Persiana Compacto:</span>
              <span class="small">
                {{ config.hasShutter ? ('Cajón ' + config.shutterBoxHeightMm + 'mm (' + config.shutterWinderType + ')') : 'Sin persiana' }}
              </span>
            </div>
            <div class="mb-2">
              <span class="small text-muted d-block">Vidrio Seleccionado:</span>
              <span class="small">{{ config.glassType }}</span>
            </div>

            <div class="border-top pt-3 mt-3">
              <span class="small text-muted d-block">Precio Estimado Partida:</span>
              <div class="h4 fw-bold text-primary font-mono mb-0">
                {{ totalPrice | number:'1.2-2' }} €
              </div>
              <small class="text-muted">({{ config.quantity }} ud. x {{ unitPrice | number:'1.2-2' }} €)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fs-xs { font-size: 0.75rem; }
    .min-vh-50 { min-height: 480px; }
    .step-pill {
      padding: 0.6rem 0.5rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }
    .step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #cbd5e1;
      color: #334155;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .step-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
    }
    .step-active .step-pill {
      background: #0284c7;
      border-color: #0284c7;
    }
    .step-active .step-num {
      background: #fff;
      color: #0284c7;
    }
    .step-active .step-title {
      color: #fff;
    }
    .step-done .step-pill {
      background: #f0fdf4;
      border-color: #86efac;
    }
    .step-done .step-num {
      background: #22c55e;
      color: #fff;
    }
    .step-done .step-title {
      color: #15803d;
    }
  `]
})
export class BudgetItemFormComponent implements OnInit {
  budgetId!: number;
  budget: Budget | null = null;
  currentStep = 1;

  config = {
    elementTypology: 'WINDOW',
    openingSystem: 'PRACTICABLE',
    leavesCount: 2,
    series: 'EUROPEAN_40',
    finish: 'BLANCO_9016',
    glassType: 'CLIMALIT_4_16_4',
    openingWidthMm: 1200,
    openingHeightMm: 1200,
    quantity: 1,
    commercialBarLengthMm: 6000,
    solapePerSideMm: 20,
    fixingType: 'SCREW_ANCHOR',
    hasShutter: true,
    shutterBoxHeightMm: 155,
    shutterWinderType: 'BUILT_IN',
    shutterSlatType: 'ALUMINIO_TERMICO',
    shutterGuideType: 'GUIA_CON_FELPUDO',
    fixedDisposition: 'NONE',
    transomProfileType: 'T_TRANSOM',
    horizontalDivisions: 0,
    verticalDivisions: 0
  };

  calcResult: StructureCalculationResult | null = null;
  shutterResult: ShutterCalculationResult | null = null;
  fixedResult: FixedModuleCalculationResult | null = null;
  glazingResult: GlazingCalculationResult | null = null;

  calculating = false;
  adding = false;

  priceBreakdown = {
    profiles: 95.00,
    glass: 65.00,
    shutter: 75.00,
    hardware: 38.00,
    labor: 50.00
  };

  unitPrice = 323.00;
  totalPrice = 323.00;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private budgetService: BudgetService,
    private calculatorService: CalculatorService
  ) {}

  ngOnInit(): void {
    const bId = this.route.snapshot.paramMap.get('id');
    if (bId) {
      this.budgetId = +bId;
      this.budgetService.getById(this.budgetId).subscribe({
        next: (b) => this.budget = b,
        error: (err) => console.error('Error cargando presupuesto:', err)
      });
    }
    this.recalculateLivePrice();
  }

  goToStep(step: number): void {
    this.currentStep = step;
    if (step === 6) {
      this.runCalculations();
    }
  }

  nextStep(): void {
    if (this.currentStep < 6) {
      this.currentStep++;
      if (this.currentStep === 6) {
        this.runCalculations();
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  runCalculations(): void {
    this.calculating = true;
    this.calculatorService.calculateStructure({
      openingWidthMm: this.config.openingWidthMm,
      openingHeightMm: this.config.openingHeightMm,
      solapePerSideMm: this.config.solapePerSideMm,
      profileMaterial: 'ALUMINIUM',
      commercialBarLengthMm: this.config.commercialBarLengthMm
    }).subscribe({
      next: (res) => {
        this.calcResult = res;
        this.recalculateLivePrice();
        this.calculating = false;
      },
      error: () => {
        this.recalculateLivePrice();
        this.calculating = false;
      }
    });

    if (this.config.hasShutter) {
      this.calculatorService.calculateShutter({
        openingWidthMm: this.config.openingWidthMm,
        openingHeightMm: this.config.openingHeightMm,
        boxHeightMm: this.config.shutterBoxHeightMm,
        winderType: this.config.shutterWinderType as any
      }).subscribe({
        next: (res) => this.shutterResult = res,
        error: () => {}
      });
    }

    this.calculatorService.calculateGlazing({
      frameInnerWidthMm: this.config.openingWidthMm - (this.config.solapePerSideMm * 2) - 100,
      frameInnerHeightMm: (this.config.openingHeightMm - (this.config.hasShutter ? this.config.shutterBoxHeightMm : 0)) - 100,
      horizontalSplits: this.config.horizontalDivisions,
      verticalSplits: this.config.verticalDivisions
    }).subscribe({
      next: (res) => this.glazingResult = res,
      error: () => {}
    });
  }

  recalculateLivePrice(): void {
    // Computes realistic pricing from dimensions and selections
    const widthM = this.config.openingWidthMm / 1000;
    const heightM = this.config.openingHeightMm / 1000;
    const areaM2 = widthM * heightM;
    const perimeterM = (widthM + heightM) * 2;

    const profileRate = this.config.series.includes('RPT') ? 16.50 : 11.20;
    this.priceBreakdown.profiles = Math.round(perimeterM * profileRate * 1.6 * 100) / 100;

    const glassRate = this.config.glassType.includes('BAJO') ? 58.00 : (this.config.glassType.includes('LAMINAR') ? 65.00 : 42.00);
    this.priceBreakdown.glass = Math.round(areaM2 * glassRate * 100) / 100;

    if (this.config.hasShutter) {
      const shutterMotorCost = this.config.shutterWinderType === 'MOTORIZED' ? 85.00 : 35.00;
      this.priceBreakdown.shutter = Math.round((areaM2 * 55.00 + shutterMotorCost) * 100) / 100;
    } else {
      this.priceBreakdown.shutter = 0;
    }

    this.priceBreakdown.hardware = Math.round((28.00 + this.config.leavesCount * 12.00) * 100) / 100;
    this.priceBreakdown.labor = Math.round((45.00 + areaM2 * 15.00) * 100) / 100;

    this.unitPrice = Math.round((
      this.priceBreakdown.profiles +
      this.priceBreakdown.glass +
      this.priceBreakdown.shutter +
      this.priceBreakdown.hardware +
      this.priceBreakdown.labor
    ) * 100) / 100;

    this.totalPrice = Math.round(this.unitPrice * this.config.quantity * 100) / 100;
  }

  addPartidaToBudget(): void {
    this.adding = true;
    const concept = `Ventana ${this.config.openingSystem} ${this.config.leavesCount}H (${this.config.openingWidthMm}x${this.config.openingHeightMm}mm) ${this.config.series} ${this.config.finish}` +
      (this.config.hasShutter ? `, con persiana compacto ${this.config.shutterBoxHeightMm}mm` : '');

    const notes = `Solape: ${this.config.solapePerSideMm}mm. Vidrio: ${this.config.glassType}. Accionamiento persiana: ${this.config.shutterWinderType}.`;

    const newItem: BudgetItem = {
      budgetId: this.budgetId,
      itemCategory: 'ALUMINIO',
      concept: concept,
      quantity: this.config.quantity,
      unit: 'ud',
      unitPrice: this.unitPrice,
      discountPercentage: 0,
      totalPrice: this.totalPrice,
      notes: notes
    };

    this.budgetService.addItem(this.budgetId, newItem).subscribe({
      next: () => {
        this.adding = false;
        this.router.navigate(['/budgets', this.budgetId]);
      },
      error: (err) => {
        console.error('Error guardando partida:', err);
        this.adding = false;
        alert('Error al añadir la partida al presupuesto.');
      }
    });
  }
}
