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
          client_id: '454906083366-v0cj08q6el8vo6j82q5hp9cqnm15.apps.googleusercontent.com',
          callback: (response: any) => this.procesarLogin(response),
          auto_select: false,
          // IMPORTANTE: Mantenemos esto en false para saltar el error de red de Chrome
          use_fedcm_for_prompt: false, 
          ux_mode: 'popup',
          context: 'signin',
        });
        clearInterval(interval);
        console.log("✅ Google SDK listo (Modo Clásico)");
      }
    }, 500);
  }

  loginConGoogle() {
    console.log("🔘 Iniciando flujo de sesión...");
    const g = (window as any).google;
    
    if (g && g.accounts) {
      // Limpiamos rastro de errores previos en las cookies
      document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Lanzamos el selector de cuentas
      g.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn("El prompt no se mostró. Reintentando apertura forzada...");
          g.accounts.id.prompt();
        }
      });
    }
  }

  procesarLogin(response: any) {
    this.ngZone.run(() => {
      try {
        console.log("🔑 Credencial recibida");
        const token = response.credential;
        this.userData = jwtDecode(token);
        console.log("👤 Usuario:", this.userData.name);
        this.cdr.detectChanges();
      } catch (error) {
        console.error("Error al procesar el token:", error);
      }
    });
  }

  logout() {
    this.userData = null;
    const g = (window as any).google;
    if (g) {
      g.accounts.id.disableAutoSelect();
    }
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.cdr.detectChanges();
    console.log("Sesión cerrada");
  }
}