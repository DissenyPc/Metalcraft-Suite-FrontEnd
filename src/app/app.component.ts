import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="app-layout">
      <app-sidebar></app-sidebar>
      <div class="main-wrapper">
        <app-header>
          <span pageTitle>Carpintería Metálica & Cerrajería</span>
        </app-header>
        <main class="content-area">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background-color: var(--bg-app);
    }
    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 260px;
      transition: margin-left 0.3s ease;
      min-width: 0;
    }
    .content-area {
      flex: 1;
      padding: 1.5rem;
      background: var(--bg-app);
      overflow-x: hidden;
    }
    @media (max-width: 992px) {
      .main-wrapper {
        margin-left: 72px;
      }
    }
  `]
})
export class AppComponent {
  title = 'Carpintería Metálica & Cerrajería';
}
