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
      const buttonElement = document.getElementById("buttonDiv");

      // Verificamos que el SDK de Google y el DIV del HTML estén listos
      if (g && g.accounts && buttonElement) {
        g.accounts.id.initialize({
          // ID de cliente corregido según tu consola
          client_id: '454906083366-v0cj08q6el8vo6j82q5hp9cj91cqnm15.apps.googleusercontent.com',
          callback: (response: any) => this.procesarLogin(response),
          auto_select: false,
          use_fedcm_for_prompt: true
        });

        // Renderizamos el botón oficial (es el método más estable)
        g.accounts.id.renderButton(
          buttonElement,
          { theme: "outline", size: "large", text: "signin_with", shape: "pill" }
        );

        clearInterval(interval);
        console.log("✅ Google SDK inicializado con el ID correcto");
      }
    }, 500);
  }

  procesarLogin(response: any) {
    this.ngZone.run(() => {
      try {
        console.log("🔑 Credencial validada con éxito");
        const token = response.credential;
        this.userData = jwtDecode(token);
        
        // Forzamos a Angular a detectar que el usuario ya entró
        this.cdr.detectChanges();
      } catch (error) {
        console.error("Error al procesar el login de Google:", error);
      }
    });
  }

  logout() {
    this.userData = null;
    const g = (window as any).google;
    if (g) {
      g.accounts.id.disableAutoSelect();
    }
    // Limpiamos la cookie de estado para permitir un inicio de sesión limpio
    document.cookie = "g_state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.cdr.detectChanges();
    
    // Volvemos a renderizar el botón tras cerrar sesión
    setTimeout(() => this.inicializarServicioGoogle(), 100);
  }
}