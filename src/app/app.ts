import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navegacion } from './componentes/navegacion/navegacion';
import { Titulo} from './componentes/titulo/titulo';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navegacion, Titulo],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Lopez_Dominguez');
}
