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
          use_fedcm_for_prompt: true // Lo activamos para cumplir con Chrome
        });

        // Esto dibuja el botón oficial en el DIV con id "buttonDiv"
        g.accounts.id.renderButton(
          document.getElementById("buttonDiv"),
          { theme: "outline", size: "large", text: "signin_with" } 
        );

        clearInterval(interval);
        console.log("✅ Botón de Google renderizado");
      }
    }, 500);
  }

  procesarLogin(response: any) {
    this.ngZone.run(() => {
      try {
        const token = response.credential;
        this.userData = jwtDecode(token);
        console.log("👤 Usuario logueado:", this.userData.name);
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
    this.cdr.detectChanges();
    // Recargamos para que el botón de Google vuelva a aparecer
    setTimeout(() => this.inicializarServicioGoogle(), 100);
  }
}