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
          // Verifica que este Client ID sea exactamente el de la consola de Google Cloud
          client_id: '454906083366-v0cj08q6el8vo6j82q5hp9cqnm15.apps.googleusercontent.com',
          callback: (response: any) => this.procesarLogin(response),
          auto_select: false,
          // Forzamos el uso de FedCM para cumplir con las nuevas reglas de Chrome
          use_fedcm_for_prompt: true,
          // Establecemos el modo popup para evitar redirecciones que causen error 403
          ux_mode: 'popup',
          context: 'signin'
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
      // Limpiamos la cookie de estado de Google para evitar bloqueos por intentos fallidos previos
      document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Lanzamos la ventana de selección de cuenta
      g.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          console.warn("El prompt no se mostró:", notification.getNotDisplayedReason());
          // Intento de respaldo forzado si el navegador lo bloquea inicialmente
          g.accounts.id.prompt();
        }
      });
    }
  }

  procesarLogin(response: any) {
    // NgZone asegura que Angular detecte el cambio de datos que viene de fuera (Google SDK)
    this.ngZone.run(() => {
      try {
        console.log("🔑 Token recibido");
        const token = response.credential;
        this.userData = jwtDecode(token);
        console.log("👤 Usuario identificado:", this.userData.name);
        
        // Forzamos la actualización de la interfaz para mostrar nombre y foto
        this.cdr.detectChanges();
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    });
  }

  logout() {
    this.userData = null;
    const g = (window as any).google;
    if (g) {
      g.accounts.id.disableAutoSelect();
    }
    // Limpiamos rastro de sesión para permitir elegir otra cuenta al volver
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.cdr.detectChanges();
    console.log("Sesión cerrada");
  }
}