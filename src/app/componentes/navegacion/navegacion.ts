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
          ux_mode: 'redirect', // CAMBIO CLAVE: Usamos redirección para saltar bloqueos de popup
          login_uri: 'https://lopez-dominguez.vercel.app', // Tu URL de Vercel
          context: 'signin'
        });
        clearInterval(interval);
        console.log("✅ Google SDK listo en modo Redirect");
      }
    }, 500);
  }

  loginConGoogle() {
    console.log("🔘 Iniciando flujo de login...");
    const g = (window as any).google;
    if (g && g.accounts) {
      // Limpiamos rastro de errores previos
      document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Lanzamos el selector de cuentas
      g.accounts.id.prompt();
    }
  }

  procesarLogin(response: any) {
    this.ngZone.run(() => {
      try {
        const token = response.credential;
        this.userData = jwtDecode(token);
        console.log("👤 Bienvenido:", this.userData.name);
        this.cdr.detectChanges();
      } catch (error) {
        console.error("Error al procesar login:", error);
      }
    });
  }

  logout() {
    this.userData = null;
    const g = (window as any).google;
    if (g) g.accounts.id.disableAutoSelect();
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.cdr.detectChanges();
  }
}