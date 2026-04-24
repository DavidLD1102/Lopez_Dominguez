import { Component, OnInit, PLATFORM_ID, Inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

declare var google: any;

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navegacion.html',
  styleUrl: './navegacion.css',
})
export class Navegacion implements OnInit {
  isBrowser: boolean;
  userData: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.inicializarServicioGoogle();
    }
  }

  inicializarServicioGoogle() {
    const interval = setInterval(() => {
      const g = (window as any).google;
      if (g && g.accounts) {
        g.accounts.id.initialize({
          client_id: '454906083366-v0cj08q6el8vo6j82q5hp9cj91cqnm15.apps.googleusercontent.com',
          callback: (response: any) => this.procesarLogin(response),
          auto_select: false // Evita que entre automático sin preguntar
        });
        clearInterval(interval);
        console.log("✅ Google SDK listo");
      }
    }, 500);
  }

  loginConGoogle() {
    console.log("🔘 Click en el botón de iniciar sesión");
    const g = (window as any).google;
    
    if (g && g.accounts) {
      // --- TRUCO MAESTRO PARA EVITAR 'suppressed_by_user' ---
      // Borramos la cookie de estado de Google para que siempre muestre el prompt
      document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      g.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn("Motivo de bloqueo:", notification.getNotDisplayedReason());
          // Si el prompt falla, intentamos una segunda vez tras limpiar
          g.accounts.id.prompt();
        }
      });
    }
  }

  procesarLogin(response: any) {
    this.ngZone.run(() => {
      try {
        console.log("🔑 Token recibido");
        this.userData = jwtDecode(response.credential);
        console.log("👤 Usuario:", this.userData.name);
        
        this.cdr.detectChanges();
      } catch (error) {
        console.error("Error al decodificar token:", error);
      }
    });
  }

  logout() {
    this.userData = null;
    const g = (window as any).google;
    if (g) {
      g.accounts.id.disableAutoSelect();
    }
    // Opcional: Limpiar cookies de sesión para permitir cambio de cuenta
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.cdr.detectChanges();
    console.log("Sesión cerrada");
  }
}