import { Routes } from '@angular/router';
import { CFamilia } from './paginas/c-familia/c-familia';
import { PaginaNoEncontrada } from './paginas/pagina-no-encontrada/pagina-no-encontrada';
import { Home } from './paginas/home/home';
import { Acercade } from './paginas/acercade/acercade';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Home },
  { path: 'familia', component: CFamilia },
  { path: 'acercade', component: Acercade },
  { path: '**', component: PaginaNoEncontrada }
  
];
