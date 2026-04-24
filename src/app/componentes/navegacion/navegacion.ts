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
          // ID de cliente verificado
          client_id: '454906083366-v0cj08q6el8vo6j82q5hp9cqnm15.apps.googleusercontent.com',
          callback: (response: any) => this.procesarLogin(response),
          auto_select: false,
          use_fedcm_for_prompt: true,
          ux_mode: 'popup',
          context: 'signin'
        });
        clearInterval(interval);
        console.log("✅ Google SDK listo");
      }
    }, 500);
  }

  loginConGoogle() {
    console.log("🔘 Iniciando flujo de sesión...");
    const g = (window as any).google;
    
    if (g && g.accounts) {
      // Limpieza de rastro de sesiones previas que causan bloqueos
      document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Lanzamos el selector de cuentas
      g.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn("El prompt no se mostró:", notification.getNotDisplayedReason());
          // Intento de respaldo si el navegador bloquea la visualización automática
          g.accounts.id.prompt();
        }
      });
    }
  }

  procesarLogin(response: any) {
    this.ngZone.run(() => {
      try {
        console.log("🔑 Credencial recibida correctamente");
        const token = response.credential;
        this.userData = jwtDecode(token);
        console.log("👤 Usuario identificado:", this.userData.name);
        
        // Forzamos la actualización de la vista de Angular
        this.cdr.detectChanges();
      } catch (error) {
        console.error("Error al procesar los datos del usuario:", error);
      }
    });
  }

  logout() {
    this.userData = null;
    const g = (window as any).google;
    if (g) {
      g.accounts.id.disableAutoSelect();
    }
    // Limpiamos rastro de sesión para permitir un nuevo inicio limpio
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.cdr.detectChanges();
    console.log("Sesión cerrada");
  }
}